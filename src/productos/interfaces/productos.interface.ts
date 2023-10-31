export interface ProductoInterface {
  id: string;
  name: string;
  clave: string;
  description: string;
  salePrice: number;
  purchaseCost: number;
  stock: number;
  active: boolean;
}
export interface FindOneProductoInterface {
  id: string;
  clave: string;
}
export interface DeleteProductoInterface {
  id: string;
  active: boolean;
}
export interface ResponseproductoInterface {
  code: number;
  message: string;
  success: boolean;
  entity: ProductoInterface | null;
}
