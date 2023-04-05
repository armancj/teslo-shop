import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/enum/valid-roles.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Auth(ValidRoles.admin)
  @Get()
  executeSeed() {
    return this.seedService.runSeed();
  }
}
