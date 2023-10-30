// ? ------------------------- INTERFACE VENTA ------------------------------//
export interface ProductoInterface {
  id: string;
  name: string;
  clave: string;
  description: string;
  salePrice: number;
  purcharseCost: number;
  stock: number;
  active: boolean;
}

// ? ------------------------- REPONSE CONSULTATIONS INTERFACE ------------------------------//
export interface ResponseproductoInterface {
  code: number;
  message: string;
  success: boolean;
  entity: ProductoInterface | null;
}
