import { ApiProperty } from '@nestjs/swagger';
import { ProductosVentaInterface } from '../interfaces/venta.interface';
import { IsInt } from 'class-validator';

export class CreateVentaDto {
  @ApiProperty()
  productosVenta: ProductosVentaInterface;

  @ApiProperty()
  @IsInt()
  descuento: number;
}
