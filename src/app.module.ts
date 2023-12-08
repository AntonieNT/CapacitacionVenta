import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesModule } from './ventas/ventas.module';
import { ProductsModule } from './productos/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
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
            durable: false
          },
        },
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    SalesModule,
    ProductsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['./**/*.entity.js'],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
