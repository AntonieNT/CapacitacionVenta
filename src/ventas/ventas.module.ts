import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { DatabaseModule } from 'src/database/database.module';
import { globalProviders } from 'src/_common/global-providers';
import { ResponseService } from 'src/_common/response.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VentasController],
  providers: [VentasService, ...globalProviders, ResponseService],
})
export class VentasModule {}
