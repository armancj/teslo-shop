import { Postgres_error_code } from '../enums/postgres_error_code.enum';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

export function handleDBExceptions(error: any, message?: string): void {
  const logger = new Logger(handleDBExceptions.name);
  if (error?.code === Postgres_error_code.UniqueViolation)
    throw new ConflictException(error?.detail);

  if (error instanceof EntityNotFoundError)
    throw new NotFoundException(`Could not find any ${message}`);

  logger.error(`${error}, code: ${error?.code}, detail: ${error?.detail} `);
  throw new InternalServerErrorException('Unexpected error check server logs');
}
