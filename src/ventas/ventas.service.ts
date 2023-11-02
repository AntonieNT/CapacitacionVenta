import { Injectable, Inject } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { VentaEntity } from 'src/_common/entities/ventas.entity';
import { v4 as uuidv4 } from 'uuid';

import { Repository, Between, DataSource, ILike, Index } from 'typeorm';
import { ResponseService } from 'src/_common/response.service';
import { ProductoEntity } from 'src/_common/entities/producto.entity';
import { ProductoInterface } from 'src/productos/interfaces/productos.interface';
import { VentaInterface } from 'src/ventas/interfaces/venta.interface';

@Injectable()
export class VentasService {
  constructor(
    @Inject('VENTA_REPOSITORY')
    private ventaRepository: Repository<VentaEntity>,

    @Inject('PRODUCTO_REPOSITORY')
    private productoRepository: Repository<ProductoEntity>,

    private dataSource: DataSource,

    private responseService: ResponseService,
  ) {}

  createUUID() {
    return uuidv4();
  }
  async create(createVentaDto: CreateVentaDto) {
    // ? ------------------------- Start Transaction ------------------------------//

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const productos: any[] = [];
      const cantidadProductos = createVentaDto.productosVenta.length;
      let totalVentaProductos = 0;
      for (let index = 0; index < cantidadProductos; index++) {
        const producto: ProductoInterface =
          await this.productoRepository.findOne({
            where: { clave: createVentaDto.productosVenta[index].clave },
          });
        if (producto != null) {
          const stock = producto.stock;
          const cantidad =
            createVentaDto.productosVenta[index].cantidadProducto;
          if (cantidad > stock) {
            throw new Error(
              'No se puede realizar la venta del producto: ' +
                createVentaDto.productosVenta[index].clave +
                ' ya que tiene stock de: ' +
                stock,
            );
          } else {
            const precioCompra = producto.purchaseCost;
            const descuento = createVentaDto.productosVenta[index].descuento;
            const precioVenta = producto.salePrice;
            const descuentoAplicado = (descuento / 100) * precioVenta;
            const precioConDescuento = precioVenta - descuentoAplicado;
            const totalVentaSinDescuento = precioVenta * cantidad;
            const totalVentaConDescuento = precioConDescuento * cantidad;
            const diferenciaVentas =
              totalVentaSinDescuento - totalVentaConDescuento;
            const porcentajeUtilidad =
              (diferenciaVentas / totalVentaSinDescuento) * 100;
            totalVentaProductos = totalVentaProductos + totalVentaConDescuento;
            const dataProducto: VentaInterface = {
              descriptionProducto: producto.description,
              cantidadProducto: cantidad,
              precioVenta: precioVenta,
              totalVenta: totalVentaConDescuento,
              precioCompra: precioCompra,
              porcentajeUtilidad: porcentajeUtilidad,
              descuento: descuento,
            };
            productos[index] = dataProducto;
            producto.stock = stock - cantidad;
            await this.productoRepository.save(producto);
          }
        } else {
          throw new Error(
            'No existe un producto con la clave: ' +
              createVentaDto.productosVenta[index].clave,
          );
        }
      }
      const cadenaJSON = JSON.stringify(productos);
      const generatedId = this.createUUID();
      const ventaToInsert: VentaEntity = {
        id: generatedId,
        cantidadProductos: cantidadProductos,
        ventaTotal: totalVentaProductos,
        productosVendidos: cadenaJSON,
      };
      // ? ------------------------- Transaction Complete ------------------------------//
      await queryRunner.manager.save(VentaEntity, ventaToInsert);
      await queryRunner.commitTransaction();
      // ? ------------------------- DELETE Dto ------------------------------//
      delete createVentaDto.productosVenta;
      // ? ------------------------- Return Object ------------------------------//
      return this.responseService.succesMessage(
        { generatedId },
        'Venta realizada correctamente',
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.message.startsWith('No existe un producto con la clave: ')) {
        return this.responseService.errorMessage(error.message);
      } else {
        if (
          error.message.startsWith(
            'No se puede realizar la venta del producto: ',
          )
        ) {
          return this.responseService.errorMessage(error.message);
        } else {
          if (error.code == '22P02') {
            return this.responseService.errorMessage(
              'El id no corresponde al fomarto UUID',
            );
          } else {
            console.log(error);
          }
        }
      }
    } finally {
      await queryRunner.release();
    }
  }
  // async findAll() {
  //   try {
  //     const producto = await this.productoRepository.find({
  //       where: { active: true },
  //     });
  //     return this.responseService.succesMessage(
  //       producto,
  //       'Productos Encontrados',
  //     );
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     console.log('Encontre productos');
  //   }
  // }
  // async findOne(id: string): Promise<ResponseproductoInterface> {
  //   try {
  //     const producto = await this.productoRepository.findOne({
  //       where: { id: id, active: true },
  //     });
  //     if (!producto) {
  //       return this.responseService.errorMessage(
  //         'No se encontro el registro con el id: ' + id,
  //       );
  //     }
  //     const dataProducto: ProductoInterface = {
  //       id: producto.id,
  //       name: producto.name,
  //       clave: producto.clave,
  //       description: producto.description,
  //       salePrice: producto.salePrice,
  //       purcharseCost: producto.purchaseCost,
  //       stock: producto.stock,
  //       active: producto.active,
  //     };
  //     return this.responseService.succesMessage(
  //       dataProducto,
  //       'Producto Encontrado',
  //     );
  //   } catch (e) {
  //     if (e.code == '22P02') {
  //       return this.responseService.errorMessage(
  //         'El id no corresponde al fomarto UUID',
  //       );
  //     } else {
  //       console.log(e);
  //     }
  //   } finally {
  //     console.log('Encontre productos');
  //   }
  // }
  // async remove(id: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     // ? ------------------------- Start Transaction ------------------------------//
  //     const producto: DeleteProductoInterface =
  //       await this.productoRepository.findOne({
  //         where: { id: id, active: true },
  //       });
  //     if (producto != null) {
  //       producto.active = false;
  //     } else {
  //       return this.responseService.succesInfo(
  //         'No existe el registro con el id: ' + id,
  //       );
  //     }
  //     // ? ------------------------- Transaction Complete ------------------------------//
  //     await queryRunner.manager.save(producto);
  //     await queryRunner.commitTransaction();
  //     // ? ------------------------- Return Object ------------------------------//
  //     return this.responseService.succesInfo(
  //       'Se ha eliminado el producto con ID' + id,
  //     );
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     console.log('error', error);
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
  // async findAllProductos(findProductoDto: FindProductoDto) {
  //   try {
  //     const page =
  //       findProductoDto.hasOwnProperty('page') == true
  //         ? findProductoDto.page
  //         : null;
  //     const take =
  //       findProductoDto.hasOwnProperty('take') == true
  //         ? findProductoDto.take
  //         : null;
  //     const skip =
  //       page != null && page != undefined
  //         ? take != null && take != undefined
  //           ? (page - 1) * take
  //           : null
  //         : null;
  //     const where: { name?: any; salePrice?: any; clave?: any } = {};
  //     const order: { name?: any; salePrice?: any } = {};
  //     function ejecutarTernarias() {
  //       findProductoDto.hasOwnProperty('name') == true
  //         ? (where.name = ILike(`%${findProductoDto.name}%`))
  //         : null;
  //       findProductoDto.hasOwnProperty('clave') == true
  //         ? (where.clave = ILike(`%${findProductoDto.clave}%`))
  //         : null;
  //       findProductoDto.hasOwnProperty('firstCost') == true
  //         ? findProductoDto.hasOwnProperty('endCost') == true
  //           ? (where.salePrice = Between(
  //               findProductoDto.firstCost,
  //               findProductoDto.endCost,
  //             ))
  //           : null
  //         : null;
  //       findProductoDto.orderSalePrice == 1
  //         ? (order.name = 'DESC')
  //         : findProductoDto.orderSalePrice == 2
  //         ? (order.name = 'ASC')
  //         : null;
  //       findProductoDto.orderName == 1
  //         ? (order.name = 'DESC')
  //         : findProductoDto.orderName == 2
  //         ? (order.name = 'ASC')
  //         : null;
  //     }
  //     ejecutarTernarias();
  //     const [data, total] = await this.productoRepository.findAndCount({
  //       skip,
  //       take,
  //       where: where,
  //       order: order,
  //     });
  //     const entity = { data, total, page };
  //     return this.responseService.succesMessage(
  //       entity,
  //       'Productos Encontrados',
  //     );
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     console.log('Encontre productos');
  //   }
  // }
  // update(id: number, updateProductoDto: UpdateProductoDto) {
  //   return `This action updates a #${id} producto`;
  // }
}
