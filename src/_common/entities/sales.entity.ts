import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'Sales' })
export class SalesEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  quantityProducts: number;

  @CreateDateColumn()
  saleDate?: Date;

  @Column()
  totalSale: number;

  @Column()
  productsSold: string;

  // @OneToMany(() => product, product => product.venta, { cascade: true })
  // products: product[];
}
