import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { Chat } from '../../db/entities/chat';
import { User } from '../../db/entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User])],
  controllers: [ChatController],
  providers: [],
})
export class ChatModule {}
