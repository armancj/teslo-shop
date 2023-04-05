import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { handleDBExceptions } from '../common/util/handle_error.function';
import * as bcrypt from 'bcrypt';
import { JwtPayloadInterface } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { password, ...userdata } = registerUserDto;

    const salt = await bcrypt.genSalt();
    const user = await this.userRepository.create({
      ...userdata,
      password: bcrypt.hashSync(password, salt),
    });

    await this.userRepository.save(user).catch((error) => {
      handleDBExceptions(error);
    });
    delete user.password;
    return user;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { password: true, email: true, id: true },
    });

    if (user && bcrypt.compareSync(password, user.password))
      return {
        ...user,
        token: this.getJwtToken({ sub: user.id }),
      };
    throw new UnauthorizedException('Credentials are incorrect');
  }

  private getJwtToken(payload: JwtPayloadInterface) {
    return this.jwtService.sign(payload);
  }

  find() {
    return this.userRepository.find({
      select: {
        email: true,
        fullName: true,
        password: true,
        roles: true,
        isActive: true,
      },
    });
  }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ sub: user.id }),
    };
  }
}
