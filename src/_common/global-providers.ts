import { DataSource } from 'typeorm';
import { ProductoEntity } from './entities/producto.entity';
export const globalProviders = [
  {
    provide: 'PRODUCTO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductoEntity),
    inject: ['DATA_SOURCE'],
  },
];
