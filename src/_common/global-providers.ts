import { DataSource } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { SalesEntity } from './entities/sales.entity';
export const globalProviders = [
  {
    provide: 'product_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'VENTA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SalesEntity),
    inject: ['DATA_SOURCE'],
  },
];
