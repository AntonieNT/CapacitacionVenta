import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { productsController } from './products.controller';
import { globalProviders } from 'src/_common/global-providers';
import { DatabaseModule } from 'src/database/database.module';
import { ResponseService } from 'src/_common/response.service';
import { PersonalizedResponseService } from 'src/_common/personalized-response.service';

@Module({
  imports: [DatabaseModule],
  controllers: [productsController],
  providers: [
    ProductsService,
    ...globalProviders,
    ResponseService,
    PersonalizedResponseService,
  ],
})
export class ProductsModule {}
