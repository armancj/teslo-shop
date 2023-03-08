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
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: ValidGender;

  @IsString({ each: true })
  @IsArray()
  sizes: ValidSizes[];

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  images?: string[];

  //type: ValidTypes;
}

type ValidSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
type ValidTypes = 'shirts' | 'pants' | 'hoodies' | 'hats';

type ValidGender = 'men' | 'women' | 'kid' | 'unisex';
