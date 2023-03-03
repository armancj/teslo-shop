import { DefaultValue } from '../enums/default-value.enum';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class GetAllQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  skip?: number = DefaultValue.Skip;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  take?: number = DefaultValue.Limit;
}
