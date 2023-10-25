import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'producto' })
export class ProductoEntity {
  @PrimaryColumn({ type: 'uuid' })
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  description: string;

  @Column()
  @ApiProperty()
  salePrice: number;

  @Column()
  @ApiProperty()
  purchaseCost: number;

  @Column()
  @ApiProperty()
  stock: number;

  @Column({ default: true })
  active: boolean;
}
