import { Injectable, Inject } from '@nestjs/common';
import { CreateVentaDto, ProductsSaleClass } from './dto/create-venta.dto';
import { SalesEntity } from 'src/_common/entities/sales.entity';
import { v4 as uuidv4 } from 'uuid';

import { Repository, DataSource } from 'typeorm';
import { ResponseService } from 'src/_common/response.service';
import { ProductEntity } from 'src/_common/entities/product.entity';
import { ProductInterface } from 'src/productos/interfaces/products.interface';
import { VentaClass } from 'src/ventas/interfaces/venta.interface';

@Injectable()
export class SalesService {
  constructor(
    @Inject('VENTA_REPOSITORY')
    private ventaRepository: Repository<SalesEntity>,

    @Inject('product_REPOSITORY')
    private productRepository: Repository<ProductEntity>,

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
      if (e.code == '22P02') {
        return this.responseService.errorMessage(
          'El id no corresponde al fomarto UUID',
        );
      } else {
        console.log(e);
      }
    } finally {
      console.log('Encontre sales');
    }
  }

  async create(createVentaDto: CreateVentaDto) {
    // ? ------------------------- Start Transaction ------------------------------//
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log('Dto');
      console.log(createVentaDto.productsVenta);
      function mergeDuplicateProducts(
        products: ProductsSaleClass[],
      ): ProductsSaleClass[] {
        const resultado: ProductsSaleClass[] = [];

        products.forEach((product) => {
          const indiceExistente = resultado.findIndex(
            (p) => p.code === product.code,
          );

          if (indiceExistente !== -1) {
            // Ya hay un product con la misma code, comprobar si el descuento es diferente.
            if (product.discount !== undefined) {
              if (resultado[indiceExistente].discount === undefined) {
                // El product existente no tiene descuento, asignar el nuevo descuento.
                resultado[indiceExistente].discount = product.discount;
              } else if (
                resultado[indiceExistente].discount !== product.discount
              ) {
                // El descuento es diferente, no se puede fusionar, crear un nuevo objeto.
                throw new Error(
                  'No se puede realizar por que existen products duplicados con diferente descuento: ' +
                    { ...product }.code,
                );
                // resultado.push({ ...product });
              }
              // Sumar la cantidad al product existente.
              resultado[indiceExistente].productQuantity +=
                product.productQuantity;
            } else {
              // El product actual no tiene descuento, agregarlo sin fusionar.
              resultado.push({ ...product });
            }
          } else {
            // No se encontró un product con la misma code, agregarlo tal cual.
            resultado.push({ ...product });
          }
        });
        return resultado;
      }
      const productsFusionados = mergeDuplicateProducts(
        createVentaDto.productsVenta,
      );
      console.log('fusionados');
      console.log(productsFusionados);
      const products: any[] = [];
      // const entitysProducts: any[] = [];
      const cantidadproducts = productsFusionados.length;
      let totalVentaproducts = 0;
      for (let index = 0; index < cantidadproducts; index++) {
        const product: ProductInterface = await this.productRepository.findOne({
          where: { code: productsFusionados[index].code },
        });
        if (product != null) {
          const stock = product.stock;
          console.log(stock);
          const cantidad = productsFusionados[index].productQuantity;
          if (cantidad > stock) {
            throw new Error(
              'No se puede realizar la venta del product: ' +
                productsFusionados[index].code +
                ' ya que tiene stock de: ' +
                stock,
            );
          } else {
            const precioVenta = product.salePrice;

            const precioCompra = product.purchaseCost;

            let descuentoproduct = productsFusionados[index].discount;
            if (descuentoproduct == null || descuentoproduct == undefined) {
              descuentoproduct = 0;
            }

            const descuentoAplicado = (descuentoproduct / 100) * precioVenta;
            const precioConDescuento = precioVenta - descuentoAplicado;

            const totalVentaConDescuento = precioConDescuento * cantidad;
            const totalsalesinDescuento = precioCompra * cantidad;

            const utilidadTotal =
              totalVentaConDescuento - totalsalesinDescuento;
            const utilidad = utilidadTotal / totalsalesinDescuento;
            const UtilidadPorcentual = utilidad * 100;
            totalVentaproducts = totalVentaproducts + totalVentaConDescuento;
            const dataproduct: VentaClass = {
              productDescription: product.description,
              productQuantity: cantidad,
              salePrice: precioVenta,
              totalSale: totalVentaConDescuento,
              pricePurchase: precioCompra,
              percentageUtility: UtilidadPorcentual,
              discount: descuentoproduct,
            };
            products[index] = dataproduct;
            product.stock = stock - cantidad;
            await queryRunner.manager.save(ProductEntity, product);

            // entitysProducts[index] = product;
          }
        } else {
          throw new Error(
            'No existe un product con la code: ' +
              createVentaDto.productsVenta[index].code,
          );
        }
      }
      const cadenaJSON = JSON.stringify(products);
      const generatedId = this.createUUID();
      const ventaToInsert: SalesEntity = {
        id: generatedId,
        quantityProducts: cantidadproducts,
        totalSale: totalVentaproducts,
        productsSold: cadenaJSON,
      };
      // ? ------------------------- Transaction Complete ------------------------------//
      // entitysProducts.forEach((product) => console.log(product));
      // entitysProducts.forEach(
      //   async (product) => await this.productRepository.save(product),
      // );
      await queryRunner.manager.save(SalesEntity, ventaToInsert);
      await queryRunner.commitTransaction();
      // ? ------------------------- DELETE Dto ------------------------------//
      delete createVentaDto.productsVenta;
      // ? ------------------------- Return Object ------------------------------//
      return this.responseService.succesMessage(
        { generatedId },
        'Venta realizada correctamente',
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.message.startsWith('No existe un product con la code: ')) {
        return this.responseService.errorMessage(error.message);
      }
      if (
        error.message.startsWith('No se puede realizar la venta del product: ')
      ) {
        return this.responseService.errorMessage(error.message);
      }
      if (error.code == '22P02') {
        return this.responseService.errorMessage(
          'El id no corresponde al fomarto UUID',
        );
      }
      if (
        error.message.startsWith(
          'No se puede realizar por que existen products duplicados con diferente descuento: ',
        )
      ) {
        return this.responseService.errorMessage(error.message);
      }
      console.log(error);
    } finally {
      await queryRunner.release();
    }
  }
}
