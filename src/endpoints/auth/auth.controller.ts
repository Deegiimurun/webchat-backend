import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthDto, SignupDto } from './auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../db/entities/user';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: AuthDto) {
    const user = await this.userRepository.findOne({
      where: { username: body.username },
    });

    if (!user) {
      throw new BadRequestException('User or password does not match');
    }

    if (bcrypt.compareSync(body.password, user.password) === false) {
      throw new BadRequestException('User or password does not match');
    }

    const payload = { username: user.username, id: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: payload,
    };
  }

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    const user = await this.userRepository.findOne({
      where: { username: body.username },
    });

    if (user) {
      throw new BadRequestException('Username already exists');
    }

    const result = await this.userRepository.save(
      this.userRepository.create({
        username: body.username,
        password: body.password,
      }),
    );

    const payload = { username: result.username, id: result.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: payload,
    };
  }
}
