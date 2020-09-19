import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket  } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { SpaceService } from 'src/space/space.service';
import { User } from 'src/user/user.entity';

@WebSocketGateway()
export class SlackGateway implements OnGatewayConnection {
  constructor(
    private readonly authService: AuthService,
    private readonly spaceService: SpaceService
  ) {}
  @WebSocketServer() wss: Server

  async handleConnection(socket: Socket): Promise<void> {
    try {
      const user = await this.handleAuthorization(socket)

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
  
      // console.log(user)
      // this.wss.of("master").on("connect", (socket) => {
      //   socket.on("msgToServer", (msg) => {
      //     this.handleMessage(socket, msg)
      //   })
      // })
    } catch (error) {
      socket.disconnect()
      throw new WsException(error.message)
    }
  }

  @SubscribeMessage('msgToServer')
  handleMessage(socket: Socket, message: any): void {
    // To do
  }
}
