import { Injectable, Inject } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductoEntity } from './entities/producto.entity';
import { FindProductoDto } from './dto/find-productos.dto';
import { v4 as uuidv4 } from 'uuid';

import { Repository, Between, IsNull, DataSource, ILike } from 'typeorm';
import { ResponseService } from 'src/_common/response.service';

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
  // async create(createProductoDto: CreateProductoDto) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   const generatedId = this.createUUID();
  //   const producto: any = await this.productoRepository.findOne({
  //     where: {
  //       id: createProductoDto.sickId,
  //       active: true,
  //     },
  //     relations: {
  //       userEntity: true,
  //     },
  //   });
  //   const generatedId = this.createUUID();
  //   const supportEquipmentToInsert: SupportEquipmentEntity = Object.assign(
  //     {},
  //     supportEquipmentDto,
  //     {
  //       id: generatedId,
  //       createdAt: new Date().toISOString(),
  //       sickId: sick.id,
  //       oldId: sick.oldId,
  //       registeredInSINBA: sick.registeredInSINBA,
  //       registerAt: new Date().toISOString(),
  //       jurisdiction: sick.jurisdiction,
  //       tablet: sick.tablet,
  //       userEntity: await this.userRepository.findOne({
  //         where: { id: sick.userEntity.id },
  //       }),
  //       sickEntity: await this.sickRepository.findOne({
  //         where: { id: supportEquipmentDto.sickId },
  //       }),
  //       updatedAt: new Date().toISOString(),
  //       updated: true,
  //     },
  //   );

  //   // ? ------------------------- Transaction Complete ------------------------------//
  //   await queryRunner.manager.save(
  //     SupportEquipmentEntity,
  //     supportEquipmentToInsert,
  //   );
  //   await queryRunner.commitTransaction();
  //   // ? ------------------------- DELETE Dto ------------------------------//
  //   delete supportEquipmentDto.wheelchair;
  //   delete supportEquipmentDto.walker;
  //   delete supportEquipmentDto.supportCane;
  //   delete supportEquipmentDto.cane4Supports;
  //   delete supportEquipmentDto.motive;
  //   delete supportEquipmentDto.request;
  //   delete supportEquipmentDto.INESick;
  //   delete supportEquipmentDto.CURPSick;
  //   delete supportEquipmentDto.medicalCertificate;
  //   delete supportEquipmentDto.addressProof;
  //   delete supportEquipmentDto.safeguarding;
  //   // ? ------------------------- Return Object ------------------------------//
  //   return this.responseService.succesMessage(
  //     { generatedId },
  //     'Registro creado correctamente',
  //   );

  //   // return 'This action adds a new producto';
  // }

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
