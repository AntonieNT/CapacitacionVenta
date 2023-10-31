import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductosVentaClass {
  id: string;
  clave?: string;
  cantidadProducto: number;
  descuento: number;
}

export class CreateVentaDto {
  @ApiProperty({
    isArray: true,
    example: [
      {
        id: 'string',
        clave: '?' + 'string',
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
