import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { globalProviders } from 'src/_common/global-providers';
import { DatabaseModule } from 'src/database/database.module';
import { ResponseService } from 'src/_common/response.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductosController],
  providers: [ProductosService, ...globalProviders, ResponseService],
})
export class ProductosModule {}
