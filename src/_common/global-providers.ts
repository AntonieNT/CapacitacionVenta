import { DataSource } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { SalesEntity } from './entities/sales.entity';
export const globalProviders = [
  {
    provide: 'PRODUCT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'SALES_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SalesEntity),
    inject: ['DATA_SOURCE'],
  },
];
