export interface ProductInterface {
  id: string;
  name: string;
  code: string;
  description: string;
  salePrice: number;
  purchaseCost: number;
  stock: number;
  active: boolean;
}
export interface FindOneProductInterface {
  id: string;
  code: string;
}
export interface DeleteProductInterface {
  id: string;
  active: boolean;
}
export interface ResponseProductInterface {
  code: number;
  message: string;
  success: boolean;
  entity: ProductInterface | null;
}
