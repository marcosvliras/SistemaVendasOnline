import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { ReturnLogin } from './dto/return-login.dto';
import { ReturnUserDto } from '../user/dto/returnUser.dto';
import { LoginPayload } from './dto/login-payload.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLogin> {
    const user = await this.userService
      .findUserByEmail(loginDto.email)
      .catch(() => undefined);

    const isMatch = await compare(loginDto.password, user?.password || '');

    if (!user || !isMatch) {
      throw new UnauthorizedException('Email or password not found');
    }

    return {
      accessToken: this.jwtService.sign({ ...new LoginPayload(user) }),
      user: new ReturnUserDto(user),
    };
  }
}
