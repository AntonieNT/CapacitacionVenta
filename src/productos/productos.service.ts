import { Injectable, Inject } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductoEntity } from 'src/_common/entities/producto.entity';
import { FindProductoDto } from './dto/find-productos.dto';
import { v4 as uuidv4 } from 'uuid';

import { Repository, Between, DataSource, ILike } from 'typeorm';
import { ResponseService } from 'src/_common/response.service';
import { ProductoInterface } from 'src/ventas/interfaces/venta.interface';

@Injectable()
export class ProductosService {
  constructor(
    @Inject('PRODUCTO_REPOSITORY')
    private productoRepository: Repository<ProductoEntity>,

    private dataSource: DataSource,

    private responseService: ResponseService,
  ) {}

  createUUID() {
    return uuidv4();
  }
  async create(createProductoDto: CreateProductoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // ? ------------------------- Start Transaction ------------------------------//
      const producto: ProductoInterface = await this.productoRepository.findOne(
        {
          where: { clave: createProductoDto.clave },
        },
      );
      if (producto != null) {
        throw new Error(
          'Ya existe un producto con la clave: ' + createProductoDto.clave,
        );
      } else {
        const generatedId = this.createUUID();
        const objToSave: ProductoEntity = {
          id: generatedId,
          clave: createProductoDto.clave,
          name: createProductoDto.name,
          description: createProductoDto.description,
          salePrice: createProductoDto.salePrice,
          purchaseCost: createProductoDto.purchaseCost,
          stock: createProductoDto.stock,
        };

        // ? ------------------------- Transaction Complete ------------------------------//
        await queryRunner.manager.save(ProductoEntity, objToSave);
        await queryRunner.commitTransaction();
        // ? ------------------------- DELETE Dto ------------------------------//
        delete createProductoDto.clave;
        delete createProductoDto.name;
        delete createProductoDto.description;
        delete createProductoDto.salePrice;
        delete createProductoDto.purchaseCost;
        delete createProductoDto.stock;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.message.startsWith('Ya existe un producto con la clave: ')) {
        return this.responseService.errorMessage(error.message);
      }
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all productos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }

  async findAllProductos(findProductoDto: FindProductoDto) {
    try {
      const page =
        findProductoDto.hasOwnProperty('page') == true
          ? findProductoDto.page
          : null;

      const take =
        findProductoDto.hasOwnProperty('take') == true
          ? findProductoDto.take
          : null;

      const skip =
        page != null && page != undefined
          ? take != null && take != undefined
            ? (page - 1) * take
            : null
          : null;

      const where: { name?: any; salePrice?: any; clave?: any } = {};

      function addNameW(name: any) {
        where.name = name;
      }

      function addSalePriceW(salePrice: any) {
        where.salePrice = salePrice;
      }

      function addClaveW(clave: any) {
        where.clave = clave;
      }

      const order: { name?: any; salePrice?: any } = {};

      function addNameO(name: any) {
        order.name = name;
      }

      function addSalePriceO(salePrice: any) {
        order.name = salePrice;
      }

      function ejecutarTernarias() {
        findProductoDto.hasOwnProperty('name') == true
          ? addNameW(ILike(`%${findProductoDto.name}%`))
          : null;
        findProductoDto.hasOwnProperty('clave') == true
          ? addClaveW(ILike(`%${findProductoDto.clave}%`))
          : null;
        findProductoDto.hasOwnProperty('firstCost') == true
          ? findProductoDto.hasOwnProperty('endCost') == true
            ? addSalePriceW(
                Between(findProductoDto.firstCost, findProductoDto.endCost),
              )
            : null
          : null;
        findProductoDto.orderSalePrice == 1
          ? addSalePriceO('DESC')
          : findProductoDto.orderSalePrice == 2
          ? addSalePriceO('ASC')
          : null;
        findProductoDto.orderName == 1
          ? addNameO('DESC')
          : findProductoDto.orderName == 2
          ? addNameO('ASC')
          : null;
      }

      ejecutarTernarias();

      console.log(order);
      console.log(where);

      const [data, total] = await this.productoRepository.findAndCount({
        skip,
        take,
        where: where,
        order: order,
      });

      const entity = { data, total, page };
      return this.responseService.succesMessage(
        entity,
        'Productos Encontrados',
      );
    } catch (e) {
      console.log(e);
    } finally {
      console.log('Encontre consultas');
    }
  }
}
