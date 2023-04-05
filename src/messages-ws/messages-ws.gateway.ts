import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from '../auth/interface/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayloadInterface;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.sub);
    } catch (e) {
      client.disconnect();
      return;
    }
    //console.log({ payload });

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket): any {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  //message-from-client
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //Message from server unique to client
    /*this.wss.emit('message-from-server', {
      fullName: 'I am M',
      message: payload.message || 'no message',
    });*/

    /*//Message from server all to client less the client initial
    client.broadcast.emit('message-from-server', {
      fullName: 'I am M',
      message: payload.message || 'no message',
    });*/

    //Message from server all to client
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no message',
    });
  }
}
