import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto extends OmitType(CreateUserDto, [
  'fullName',
] as const) {
  @IsNotEmpty()
  password: string;
}
