import { Injectable, Inject } from '@nestjs/common';
import { CreateproductDto } from './dto/create-product.dto';
import { UpdateproductDto } from './dto/update-product.dto';
import { ProductEntity } from 'src/_common/entities/product.entity';
import { FindproductDto } from './dto/find-product.dto';
import { v4 as uuidv4 } from 'uuid';

import { Repository, Between, DataSource, ILike } from 'typeorm';
import { ResponseService } from 'src/_common/response.service';
import {
  DeleteProductInterface,
  FindOneProductInterface,
  ProductInterface,
  ResponseProductInterface,
} from './interfaces/products.interface';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('product_REPOSITORY')
    private productRepository: Repository<ProductEntity>,

    private dataSource: DataSource,

    private responseService: ResponseService,
  ) {}

  createUUID() {
    return uuidv4();
  }
  async create(createproductDto: CreateproductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // ? ------------------------- Start Transaction ------------------------------//
      const product: FindOneProductInterface =
        await this.productRepository.findOne({
          where: { code: createproductDto.code },
        });
      console.log(product);
      if (product != null) {
        throw new Error('Ya existe un product con la code: ' + product.code);
      } else {
        const generatedId = this.createUUID();
        const objToSave: ProductEntity = {
          id: generatedId,
          code: createproductDto.code,
          name: createproductDto.name,
          description: createproductDto.description,
          salePrice: createproductDto.salePrice,
          purchaseCost: createproductDto.purchaseCost,
          stock: createproductDto.stock,
          active: true,
        };

        // ? ------------------------- Transaction Complete ------------------------------//
        await queryRunner.manager.save(ProductEntity, objToSave);
        await queryRunner.commitTransaction();
        // ? ------------------------- DELETE Dto ------------------------------//
        delete createproductDto.code;
        delete createproductDto.name;
        delete createproductDto.description;
        delete createproductDto.salePrice;
        delete createproductDto.purchaseCost;
        delete createproductDto.stock;

        return this.responseService.succesInfo(
          'Se registro el product con id: ' + generatedId,
        );
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.message.startsWith('Ya existe un product con la code: ')) {
        return this.responseService.errorMessage(error.message);
      }
    } finally {
      await queryRunner.release();
    }
  }
  async findAll() {
    try {
      const product = await this.productRepository.find({
        where: { active: true },
      });
      return this.responseService.succesMessage(
        product,
        'products Encontrados',
      );
    } catch (e) {
      console.log(e);
    } finally {
      console.log('Encontre products');
    }
  }
  async findOne(id: string): Promise<ResponseProductInterface> {
    try {
      const product = await this.productRepository.findOne({
        where: { id: id, active: true },
      });
      if (!product) {
        return this.responseService.errorMessage(
          'No se encontro el registro con el id: ' + id,
        );
      }
      const dataproduct: ProductInterface = {
        id: product.id,
        name: product.name,
        code: product.code,
        description: product.description,
        salePrice: product.salePrice,
        purchaseCost: product.purchaseCost,
        stock: product.stock,
        active: product.active,
      };
      return this.responseService.succesMessage(
        dataproduct,
        'product Encontrado',
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
      console.log('Encontre products');
    }
  }
  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // ? ------------------------- Start Transaction ------------------------------//
      const product: DeleteProductInterface =
        await this.productRepository.findOne({
          where: { id: id, active: true },
        });
      if (product != null) {
        product.active = false;
      } else {
        return this.responseService.succesInfo(
          'No existe el registro con el id: ' + id,
        );
      }
      // ? ------------------------- Transaction Complete ------------------------------//
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      // ? ------------------------- Return Object ------------------------------//
      return this.responseService.succesInfo(
        'Se ha eliminado el product con ID' + id,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('error', error);
    } finally {
      await queryRunner.release();
    }
  }
  async findAllproducts(findproductDto: FindproductDto) {
    try {
      const page =
        findproductDto.hasOwnProperty('page') == true
          ? findproductDto.page
          : null;
      const take =
        findproductDto.hasOwnProperty('take') == true
          ? findproductDto.take
          : null;
      const skip =
        page != null && page != undefined
          ? take != null && take != undefined
            ? (page - 1) * take
            : null
          : null;
      const where: { name?: any; salePrice?: any; code?: any } = {};
      const order: { name?: any; salePrice?: any } = {};
      function ejecutarTernarias() {
        findproductDto.hasOwnProperty('name') == true
          ? (where.name = ILike(`%${findproductDto.name}%`))
          : null;
        findproductDto.hasOwnProperty('code') == true
          ? (where.code = ILike(`%${findproductDto.code}%`))
          : null;
        findproductDto.hasOwnProperty('firstCost') == true
          ? findproductDto.hasOwnProperty('endCost') == true
            ? (where.salePrice = Between(
                findproductDto.firstCost,
                findproductDto.endCost,
              ))
            : null
          : null;
        findproductDto.orderSalePrice == 1
          ? (order.salePrice = 'DESC')
          : findproductDto.orderSalePrice == 2
          ? (order.salePrice = 'ASC')
          : null;
        findproductDto.orderName == 1
          ? (order.name = 'DESC')
          : findproductDto.orderName == 2
          ? (order.name = 'ASC')
          : null;
      }
      ejecutarTernarias();
      const [data, total] = await this.productRepository.findAndCount({
        skip,
        take,
        where: where,
        order: order,
      });
      const entity = { data, total, page };
      return this.responseService.succesMessage(entity, 'products Encontrados');
    } catch (e) {
      console.log(e);
    } finally {
      console.log('Encontre products');
    }
  }
  update(id: number, updateproductDto: UpdateproductDto) {
    return `This action updates a #${id} product`;
  }
}
