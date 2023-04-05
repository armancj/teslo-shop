import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser, RawHeaders, Auth } from './decorators';
import { LoginUserDto, RegisterUserDto } from './dto';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { ValidRoles } from './enum/valid-roles.enum';
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'hello private',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
