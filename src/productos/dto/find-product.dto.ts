import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Max,
  Min,
} from 'class-validator';

export class FindproductDto {
  @ApiPropertyOptional({ example: 'coca' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'coca' })
  @IsOptional()
  @IsString()
  code: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  firstCost: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  endCost: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt({ message: 'Rangos valido 1-2' })
  @Min(1)
  @Max(2)
  orderSalePrice: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt({ message: 'Rangos valido 1-2' })
  @Min(1)
  @Max(2)
  orderName: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  take: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  page: number;
}
