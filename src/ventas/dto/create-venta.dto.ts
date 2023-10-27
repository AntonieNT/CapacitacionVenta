import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductosVentaClass {
  id: string;
  clave?: string;
  cantidadProducto: number;
}

export class CreateVentaDto {
  @ApiProperty()
  @IsInt()
  descuento: number;

  @ApiProperty({
    isArray: true,
    example: [
      {
        id: 'string',
        clave: '?' + 'string',
        cantidadProducto: 'number',
      },
    ],
  })
  @IsArray({ message: 'Debe de ser un array de productos' })
  @ValidateNested({ each: true })
  @Type(() => ProductosVentaClass)
  productosVenta: ProductosVentaClass[];
}
