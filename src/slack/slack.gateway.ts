import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket  } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { RoomService } from 'src/room/room.service';
import { Space } from 'src/space/space.entity';
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
      console.log("CLIENT CONNECTED")
      const { user } = socket.handshake.headers
      const channels = await this.userService.getChannels(user._id)
      this.wss.emit("loadChannels", channels)

      await this.handleChannels(channels)
    } catch (error) {
      return error
    }
  }

  async handleAuthorization(socket: Socket): Promise<User> {
    try {
      const { handshake: { headers: { authorization} }} = socket
      console.log(socket.handshake)
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
      throw new WsException(error.message)
    }
  }

  async handleChannels(channels: Space[]): Promise<void> {
    channels.forEach((channel) => {
      this.wss.of(channel._id).on("connect", (nssocket) => {
        nssocket.on("joinRoom", (roomId) => this.handleJoinRoom(nssocket, roomId))
        nssocket.on("messageToRoom", (message) => this.handleMessageToRoom(nssocket, message))
      })
    })
  }

  async handleJoinRoom(socket: Socket, roomToJoinId: string): Promise<void> {
    const [_, roomToLeaveId] = Object.keys(socket.rooms)
    socket.leave(roomToLeaveId)
    socket.join(roomToJoinId)
    const room = await this.roomService.findOne(roomToJoinId)
    socket.emit("joinedRoom", room)
  }

  handleMessageToChannel(socket: Socket, message: string): void {
    // To do
  }

  async handleMessageToRoom(socket: Socket, payload: { text: string}): Promise<void> {
    const { text } = payload
    const [_, roomId] = Object.keys(socket.rooms)
    const room = await this.roomService.findOne(roomId)
    console.log(socket.handshake.headers)
    const messageDTO: MessageDTO = {
      text,
      owner: socket.handshake.headers?.user?._id,
      time: Date.now()
    }

    const message = await this.messageService.create(messageDTO)

    room.messages.push(message)
    await room.save()

    socket.to(roomId).emit("messageToClient", message)
  }
}
