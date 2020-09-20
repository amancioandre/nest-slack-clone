import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket  } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { RoomService } from 'src/room/room.service';
import { MessageDTO } from 'src/message/dto/message.dto';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway()
export class SlackGateway implements OnGatewayConnection, OnGatewayInit {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly messageService: MessageService
  ) {}
  @WebSocketServer() wss: Server

  afterInit(server: Server): void {
    server.use(async (socket: Socket, next) => {
      const user = await this.handleAuthorization(socket)
      if (!user) {
        return
      }
      socket.handshake.headers.user = user
      next()
    })
  }

  async handleConnection(socket: Socket): Promise<void> {
    try {
      const { user } = socket.handshake.headers
      const channels = await this.userService.getChannels(user._id)
      this.wss.emit("loadChannels", channels)
    } catch (error) {
      return error
    }
  }

  async handleAuthorization(socket: Socket): Promise<User | UnauthorizedException> {
    try {
      const { handshake: { headers: { authorization} }} = socket
      if (!authorization) {
        throw new UnauthorizedException()
      }

      const [bearer, token] = authorization?.split(' ');
      // console.log("TOKEN", token)
  
      const user = await this.authService.validateFromToken(token)
  
      if (!user) {
        throw new UnauthorizedException()
      }

      return user
    } catch (error) {
      socket.disconnect()
      return error
    }
  }

  @SubscribeMessage("joinRoom")
  async handleJoinRoom(socket: Socket, roomToJoinId: string): Promise<void> {
    const [_, roomToLeaveId] = Object.keys(socket.rooms)
    socket.leave(roomToLeaveId)
    this.updateUsersInRoom(roomToLeaveId)
    socket.join(roomToJoinId)
    this.updateUsersInRoom(roomToJoinId)
    const room = await this.roomService.findOne(roomToJoinId)
    socket.emit("joinedRoom", room)
  }

  @SubscribeMessage("messageToRoom")
  async handleMessageToRoom(socket: Socket, payload: { roomId: string, text: string}): Promise<void> {
    const { roomId, text } = payload
    const [_, socketRoomId] = Object.keys(socket.rooms)
    const room = await this.roomService.findOne(roomId)
    const messageDTO: MessageDTO = {
      text,
      owner: socket.handshake.headers?.user?._id,
      time: Date.now()
    }

    const message = await this.messageService.create(messageDTO)
    await message.save()
    await message.populate("owner").execPopulate()

    room.messages.push(message)
    await room.save()


    this.wss.to(socketRoomId).emit("messageFromRoom", room.messages)
  }

  updateUsersInRoom(roomId: string): void {
    this.wss.in(roomId).clients((err, clients) => {
      this.wss.to(roomId).emit("updateClients", clients.length)
    })
  }
}
