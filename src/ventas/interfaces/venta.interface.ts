export interface VentaInterface {
  descriptionProducto: string;
  cantidadProducto: number;
  precioVenta: number;
  totalVenta: number;
  precioCompra: number;
  porcentajeUtilidad: number;
  descuento: string;
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
  entity: VentaInterface | null;
}
