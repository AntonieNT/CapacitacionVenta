import { ProductInterface } from 'src/productos/interfaces/products.interface';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Product' })
export class ProductEntity implements ProductInterface{
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  // @Column({ nullable: true, unique: true })
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  salePrice: number;

  @Column()
  purchaseCost: number;

  @Column()
  stock: number;

  @Column({ default: true })
  active: boolean;

  // @ManyToOne(() => Venta, venta => venta.products)
  // @JoinColumn({ name: 'ventaId' })
  // venta: Venta;
}
