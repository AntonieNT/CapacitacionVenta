import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { productsController } from './products.controller';
import { globalProviders } from 'src/_common/global-providers';
import { DatabaseModule } from 'src/database/database.module';
import { ResponseService } from 'src/_common/response.service';
import { PersonalizedResponseService } from 'src/_common/personalized-response.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'EMIT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://btsfvmup:Csy92181kPAdpIXvE1avDdROykMZeE6-@shrimp.rmq.cloudamqp.com/btsfvmup',
          ],
          queue: 'cats_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [productsController],
  providers: [
    ProductsService,
    ...globalProviders,
    ResponseService,
    PersonalizedResponseService,
  ],
})
export class ProductsModule {}
