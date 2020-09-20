import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket  } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { RoomService } from 'src/room/room.service';
import { Space } from 'src/space/space.entity';

@WebSocketGateway()
export class SlackGateway implements OnGatewayConnection {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roomService: RoomService
  ) {}
  @WebSocketServer() wss: Server

  async handleConnection(socket: Socket): Promise<void> {
    try {
      const user = await this.handleAuthorization(socket)

      const channels = await this.userService.getChannels(user._id)
      this.wss.emit("loadChannels", channels)

      await this.handleChannels(channels)
    } catch (error) {
      return error
    }
  }

  async handleAuthorization(socket: Socket): Promise<User> {
    try {
      console.log("CLIENT CONNECTED TO SERVER")
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
      throw new WsException(error.message)
    }
  }

  async handleChannels(channels: Space[]): Promise<void> {
    channels.forEach((channel) => {
      this.wss.of(channel._id).on("connect", (nssocket) => {
        nssocket.on("joinRoom", (roomId) => this.handleJoinRoom(nssocket, roomId))
      })
    })
  }

  async handleJoinRoom(socket: Socket, roomToJoinId: string): Promise<void> {
    // To do
  }

  handleLeaveRoom(socket: Socket, roomToLeaveId: string): void {
    // To do
  }

  handleMessageToChannel(socket: Socket, message: string): void {
    // To do
  }

  handleMessageToRoom(socket: Socket, message: { room: string, text: string}): void {
    // To do
  }
}
