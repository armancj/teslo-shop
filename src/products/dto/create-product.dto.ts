import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  readonly title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly price?: number;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly stock?: number;

  @IsIn(['men', 'women', 'kid', 'unisex'])
  readonly gender: ValidGender;

  @IsString({ each: true })
  @IsArray()
  readonly sizes: ValidSizes[];

  //tags: string[];

  //images: string[];
  //type: ValidTypes;
}

type ValidSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
type ValidTypes = 'shirts' | 'pants' | 'hoodies' | 'hats';

type ValidGender = 'men' | 'women' | 'kid' | 'unisex';
