import { IntersectionType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { PasswordPropertyDto } from './password-property.dto';

export class RegisterUserDto extends IntersectionType(
  CreateUserDto,
  PasswordPropertyDto,
) {}
