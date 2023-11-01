import { DataSource } from 'typeorm';
import { ProductoEntity } from './entities/producto.entity';
import { VentaEntity } from './entities/ventas.entity';
export const globalProviders = [
  {
    provide: 'PRODUCTO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductoEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'VENTA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(VentaEntity),
    inject: ['DATA_SOURCE'],
  },
];
