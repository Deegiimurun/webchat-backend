import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Chat } from '../../db/entities/chat';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../db/entities/user';

@Controller('chat')
export class ChatController {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get('list')
  async getChat(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
  ) {
    return await this.chatRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC', id: 'DESC' },
      take: limit,
      skip: page * limit - limit,
    });
  }
  @Get('online')
  async getOnlineUsers() {
    return await this.userRepository.find({
      select: ['username'],
      where: { isOnline: true },
    });
  }
}
