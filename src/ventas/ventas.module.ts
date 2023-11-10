import { Module } from '@nestjs/common';
import { SalesService } from './ventas.service';
import { SalesController } from './ventas.controller';
import { DatabaseModule } from 'src/database/database.module';
import { globalProviders } from 'src/_common/global-providers';
import { ResponseService } from 'src/_common/response.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SalesController],
  providers: [SalesService, ...globalProviders, ResponseService],
})
export class SalesModule {}
