import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'Venta' })
export class VentaEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  ventaTotal: number;

  @Column()
  descuento: number;

  @Column()
  porcentajeUtilidad: string;

  @Column()
  dateVenta: Date;

  @Column({ default: true })
  active: boolean;

  @Column()
  productosVenta: string;
}
