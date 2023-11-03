import { Injectable, Inject } from '@nestjs/common';
import { CreateVentaDto, ProductosVentaClass } from './dto/create-venta.dto';
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

  async findOne(id: string) {
    try {
      const venta = await this.ventaRepository.find({
        where: { id: id },
      });
      return this.responseService.succesMessage(venta, 'Venta Encontrada');
    } catch (e) {
      console.log(e);
    } finally {
      console.log('Encontre ventas');
    }
  }

  async create(createVentaDto: CreateVentaDto) {
    // ? ------------------------- Start Transaction ------------------------------//
    console.log(createVentaDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log(createVentaDto.productosVenta);
      
      function fusionarProductosDuplicados(
        productos: ProductosVentaClass[],
      ): ProductosVentaClass[] {
        const resultado: ProductosVentaClass[] = [];
        productos.forEach((producto) => {
          const indiceExistente = resultado.findIndex(
            (p) => p.clave === producto.clave,
          );
          if (indiceExistente !== -1) {
            // Ya hay un producto con la misma clave, fusionarlos.
            resultado[indiceExistente].cantidadProducto +=
              producto.cantidadProducto;

            if (producto.descuento !== undefined) {
              // Solo actualizar el descuento si está presente en el producto actual.
              resultado[indiceExistente].descuento = producto.descuento;
            }
          } else {
            // No se encontró un producto con la misma clave, agregarlo tal cual.
            resultado.push({ ...producto });
          }
        });
        return resultado;
      }
      const productosFusionados = fusionarProductosDuplicados(
        createVentaDto.productosVenta,
      );
      console.log(productosFusionados);
      const productos: any[] = [];
      const cantidadProductos = productosFusionados.length;
      let totalVentaProductos = 0;

      for (let index = 0; index < cantidadProductos; index++) {
        const producto: ProductoInterface =
          await this.productoRepository.findOne({
            where: { clave: productosFusionados[index].clave },
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
            let descuentoDTO = createVentaDto.productosVenta[index].descuento;
            if (descuentoDTO == null || descuentoDTO == undefined) {
              descuentoDTO = 0;
            }
            const descuento = descuentoDTO;
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
}
