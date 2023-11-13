import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductsSaleClass {
  @IsString()
  code: string;

  @IsNumber()
  productQuantity: number;

  @IsNumber()
  @IsOptional()
  discount?: number;
}

export class CreateVentaDto {
  @ApiProperty({
    isArray: true,
    example: [
      {
        code: 'string',
        productQuantity: 'number',
        discount: 'number',
      },
    ],
  })
  @IsArray({ message: 'Debe de ser un array de products' })
  @ValidateNested({ each: true })
  @Type(() => ProductsSaleClass)
  productsSale: ProductsSaleClass[];
}
