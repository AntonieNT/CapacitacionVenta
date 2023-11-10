export class VentaClass {
  productDescription: string;
  productQuantity: number;
  salePrice: number;
  totalSale: number;
  pricePurchase: number;
  percentageUtility: number;
  discount: number;
}

export interface FindOneVentaInterface {
  id: string;
  active: boolean;
}
// ? ------------------------- REPONSE CONSULTATIONS INTERFACE ------------------------------//
export interface ResponseVentaInterface {
  code: number;
  message: string;
  success: boolean;
  entity: VentaClass | null;
}
