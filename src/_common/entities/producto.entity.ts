import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'producto' })
export class ProductoEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  // @Column({ nullable: true, unique: true })
  @Column({ unique: true })
  clave: string;

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
}
