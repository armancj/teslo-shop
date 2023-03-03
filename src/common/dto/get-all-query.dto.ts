import { DefaultValue } from '../enums/default-value.enum';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  skip?: number = DefaultValue.Skip;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  take?: number = DefaultValue.Limit;
}
