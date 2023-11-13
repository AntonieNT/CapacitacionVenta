import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { CreateVentaDto, ProductsSaleClass } from './dto/create-venta.dto';
import { SalesEntity } from 'src/_common/entities/sales.entity';
import { v4 as uuidv4 } from 'uuid';

import { Repository, DataSource } from 'typeorm';
import { ResponseService } from 'src/_common/response.service';
import { ProductEntity } from 'src/_common/entities/product.entity';
import { ProductInterface } from 'src/productos/interfaces/products.interface';
import { VentaClass } from 'src/ventas/interfaces/venta.interface';
import { PersonalizedResponseService } from 'src/_common/personalized-response.service';
@Injectable()
export class SalesService {
  constructor(
    @Inject('SALES_REPOSITORY')
    private saleRepository: Repository<SalesEntity>,

    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<ProductEntity>,

    private dataSource: DataSource,

    private responseService: ResponseService,

    private personalizedResponseService: PersonalizedResponseService,
  ) {}

  createUUID() {
    return uuidv4();
  }

  async findOne(id: string) {
    try {
      const sale = await this.saleRepository.find({
        where: { id: id },
      });
      return this.responseService.succesMessage(sale, 'Venta Encontrada');
    } catch (e) {
      return this.personalizedResponseService.catch(e);
    } finally {
      console.log('FoundSales');
    }
  }

  async create(createVentaDto: CreateVentaDto) {
    // ? ------------------------- Start Transaction ------------------------------//
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log('Dto');
      console.log(createVentaDto.productsSale);
      function mergeDuplicateProducts(
        products: ProductsSaleClass[],
      ): ProductsSaleClass[] {
        const result: ProductsSaleClass[] = [];
        products.forEach((product) => {
          const index = result.findIndex((p) => p.code === product.code);
          if (index !== -1) {
            // There is already a product with the same code, check if the discount is different.
            if (product.discount !== undefined) {
              if (result[index].discount === undefined) {
                // The existing product does not have a discount, assign the new discount..
                result[index].discount = product.discount;
              } else if (result[index].discount !== product.discount) {
                // Discount is different, cannot be merged, create a new object.
                throw new HttpException(
                  `No se puede realizar por que el producto ${
                    { ...product }.code
                  } tiene diferente descuento.`,
                  HttpStatus.UNAUTHORIZED,
                );
                // result.push({ ...product });
              }
              // Add the quantity to the existing product.
              result[index].productQuantity += product.productQuantity;
            } else {
              // Add the quantity to the existing product.
              result.push({ ...product });
            }
          } else {
            // A product with the same code was not found, add it as is.
            result.push({ ...product });
          }
        });
        return result;
      }
      const productsMerged = mergeDuplicateProducts(
        createVentaDto.productsSale,
      );
      console.log('merged');
      console.log(productsMerged);
      const products: any[] = [];
      // const entitysProducts: any[] = [];
      const quantityObjects = productsMerged.length;
      let quantityProducts = 0;
      let totalSaleProducts = 0;
      for (let index = 0; index < quantityObjects; index++) {
        const product: ProductInterface = await this.productRepository.findOne({
          where: { code: productsMerged[index].code },
        });
        if (product != null) {
          const stock = product.stock;
          console.log(stock);
          const quantity = productsMerged[index].productQuantity;
          quantityProducts = quantityProducts + quantity;
          if (quantity > stock) {
            throw new HttpException(
              `No se puede realizar la venta del producto: ${productsMerged[index].code} ya que tiene stock de: ${stock}`,
              HttpStatus.UNAUTHORIZED,
            );
          } else {
            const salePrice = product.salePrice;
            const pricePurchase = product.purchaseCost;
            let discountProduct = productsMerged[index].discount;
            if (discountProduct == null || discountProduct == undefined) {
              discountProduct = 0;
            }
            const discountApplied = (discountProduct / 100) * salePrice;
            const priceWithDiscount = salePrice - discountApplied;
            const totalSaleWithDiscount = priceWithDiscount * quantity;
            const totalSalesNoDiscount = pricePurchase * quantity;
            const utilityTotal = totalSaleWithDiscount - totalSalesNoDiscount;
            const utility = utilityTotal / totalSalesNoDiscount;
            const utilityPorcentual = utility * 100;
            totalSaleProducts = totalSaleProducts + totalSaleWithDiscount;
            const dataproduct: VentaClass = {
              productDescription: product.description,
              productQuantity: quantity,
              salePrice: salePrice,
              totalSale: totalSaleWithDiscount,
              pricePurchase: pricePurchase,
              percentageUtility: utilityPorcentual,
              discount: discountProduct,
            };
            products[index] = dataproduct;
            product.stock = stock - quantity;
            await queryRunner.manager.save(ProductEntity, product);
          }
        } else {
          throw new HttpException(
            `Producto con clave ${productsMerged[index].code} no encontrado.`,
            HttpStatus.NOT_FOUND,
          );
        }
      }
      const JsonString = JSON.stringify(products);
      const generatedId = this.createUUID();
      const saleToInsert: SalesEntity = {
        id: generatedId,
        quantityProducts: quantityProducts,
        totalSale: totalSaleProducts,
        productsSold: JsonString,
      };
      // ? ------------------------- Transaction Complete ------------------------------//
      await queryRunner.manager.save(SalesEntity, saleToInsert);
      await queryRunner.commitTransaction();
      // ? ------------------------- DELETE Dto ------------------------------//
      delete createVentaDto.productsSale;
      // ? ------------------------- Return Object ------------------------------//
      return this.responseService.succesMessage(
        { generatedId },
        'Venta realizada correctamente',
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return this.personalizedResponseService.catch(error);
    } finally {
      await queryRunner.release();
    }
  }
}
