import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'Venta' })
export class VentaEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  cantidadProductos: number;

  @CreateDateColumn()
  dateVenta?: Date;

  @Column()
  ventaTotal: number;

  @Column()
  productosVendidos: string;
}
