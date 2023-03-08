import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { handleDBExceptions } from '../common/util/handle_error.function';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      select: { password: true, email: true },
    });

    if (user && bcrypt.compareSync(password, user.password)) return user;
    throw new UnauthorizedException('Credentials are incorrect');
  }
}
