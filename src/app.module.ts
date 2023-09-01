import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './endpoints/auth/auth.module';
import { ChatWsModule } from './gateways/chat/chat-ws.module';
import { ChatModule } from './endpoints/chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'webchat',
      entities: [__dirname + '/db/entities/*{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    ChatWsModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
