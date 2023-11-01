import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductosVentaClass {
  @IsString()
  @IsOptional()
  clave?: string;

  @IsNumber()
  cantidadProducto: number;

  @IsNumber()
  @IsOptional()
  descuento?: number;
}

export class CreateVentaDto {
  @ApiProperty({
    isArray: true,
    example: [
      {
        clave: 'string',
        cantidadProducto: 'number',
        descuento: 'number',
      },
    ],
  })
  @IsArray({ message: 'Debe de ser un array de productos' })
  @ValidateNested({ each: true })
  @Type(() => ProductosVentaClass)
  productosVenta: ProductosVentaClass[];
}
