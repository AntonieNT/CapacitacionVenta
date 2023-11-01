import { Injectable, Inject } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductoEntity } from 'src/_common/entities/producto.entity';
import { FindProductoDto } from './dto/find-productos.dto';
import { v4 as uuidv4 } from 'uuid';

import { Repository, Between, DataSource, ILike } from 'typeorm';
import { ResponseService } from 'src/_common/response.service';
import {
  DeleteProductoInterface,
  FindOneProductoInterface,
  ProductoInterface,
  ResponseproductoInterface,
} from './interfaces/productos.interface';

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
      const producto: FindOneProductoInterface =
        await this.productoRepository.findOne({
          where: { clave: createProductoDto.clave },
        });
      console.log(producto);
      if (producto != null) {
        throw new Error(
          'Ya existe un producto con la clave: ' + producto.clave,
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
          active: true,
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

        return this.responseService.succesInfo(
          'Se registro el producto con id: ' + generatedId,
        );
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
  async findAll() {
    try {
      const producto = await this.productoRepository.find({
        where: { active: true },
      });
      return this.responseService.succesMessage(
        producto,
        'Productos Encontrados',
      );
    } catch (e) {
      console.log(e);
    } finally {
      console.log('Encontre productos');
    }
  }
  async findOne(id: string): Promise<ResponseproductoInterface> {
    try {
      const producto = await this.productoRepository.findOne({
        where: { id: id, active: true },
      });
      if (!producto) {
        return this.responseService.errorMessage(
          'No se encontro el registro con el id: ' + id,
        );
      }
      const dataProducto: ProductoInterface = {
        id: producto.id,
        name: producto.name,
        clave: producto.clave,
        description: producto.description,
        salePrice: producto.salePrice,
        purchaseCost: producto.purchaseCost,
        stock: producto.stock,
        active: producto.active,
      };
      return this.responseService.succesMessage(
        dataProducto,
        'Producto Encontrado',
      );
    } catch (e) {
      if (e.code == '22P02') {
        return this.responseService.errorMessage(
          'El id no corresponde al fomarto UUID',
        );
      } else {
        console.log(e);
      }
    } finally {
      console.log('Encontre productos');
    }
  }
  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // ? ------------------------- Start Transaction ------------------------------//
      const producto: DeleteProductoInterface =
        await this.productoRepository.findOne({
          where: { id: id, active: true },
        });
      if (producto != null) {
        producto.active = false;
      } else {
        return this.responseService.succesInfo(
          'No existe el registro con el id: ' + id,
        );
      }
      // ? ------------------------- Transaction Complete ------------------------------//
      await queryRunner.manager.save(producto);
      await queryRunner.commitTransaction();
      // ? ------------------------- Return Object ------------------------------//
      return this.responseService.succesInfo(
        'Se ha eliminado el producto con ID' + id,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('error', error);
    } finally {
      await queryRunner.release();
    }
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
      const order: { name?: any; salePrice?: any } = {};
      function ejecutarTernarias() {
        findProductoDto.hasOwnProperty('name') == true
          ? (where.name = ILike(`%${findProductoDto.name}%`))
          : null;
        findProductoDto.hasOwnProperty('clave') == true
          ? (where.clave = ILike(`%${findProductoDto.clave}%`))
          : null;
        findProductoDto.hasOwnProperty('firstCost') == true
          ? findProductoDto.hasOwnProperty('endCost') == true
            ? (where.salePrice = Between(
                findProductoDto.firstCost,
                findProductoDto.endCost,
              ))
            : null
          : null;
        findProductoDto.orderSalePrice == 1
          ? (order.salePrice = 'DESC')
          : findProductoDto.orderSalePrice == 2
          ? (order.salePrice = 'ASC')
          : null;
        findProductoDto.orderName == 1
          ? (order.name = 'DESC')
          : findProductoDto.orderName == 2
          ? (order.name = 'ASC')
          : null;
      }
      ejecutarTernarias();
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
      console.log('Encontre productos');
    }
  }
  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }
}
