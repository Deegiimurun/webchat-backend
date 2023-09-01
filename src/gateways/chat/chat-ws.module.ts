import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../db/entities/user';
import { Chat } from '../../db/entities/chat';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat])],
  controllers: [],
  providers: [ChatGateway],
})
export class ChatWsModule {}
