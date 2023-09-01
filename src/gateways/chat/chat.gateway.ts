import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../db/entities/user';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Chat } from '../../db/entities/chat';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Socket;

  a = 0;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    private jwtService: JwtService,
  ) {}

  @SubscribeMessage('chat')
  async handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = this.jwtService.verify(
        client.handshake.headers.authorization,
      );

      const user = await this.userRepository.findOne({
        where: {
          id: result.id,
        },
        cache: true,
      });

      const chat = await this.chatRepository.save({
        chat: message,
        user,
      });

      this.server.emit('chat', {
        ...chat,
        user,
      });
    } catch (e) {
      client.disconnect(true);
    }
  }

  async handleConnection(client: Socket) {
    try {
      if (!client.handshake.headers.authorization) {
        client.disconnect(true);
      }
      const result = this.jwtService.verify(
        client.handshake.headers.authorization,
      );
      this.userRepository.update(result.id, { isOnline: true });
    } catch (e) {
      console.log(e);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): any {
    if (!client.handshake.headers.authorization) {
      client.disconnect(true);
    }
    const result = this.jwtService.verify(
      client.handshake.headers.authorization,
    );
    this.userRepository.update(result.id, { isOnline: false });
  }
}
