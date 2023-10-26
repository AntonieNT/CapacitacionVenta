// ? ------------------------- INTERFACE VENTA ------------------------------//
export interface VentaInterface {
  descriptionProducto: string;
  cantidadProducto: boolean;
  precioVenta: number;
  totalVenta: number;
  precioCompra: number;
  descuento: string;
}
export interface ProductosVentaInterface {
  id: string;
  clave: string;
  cantidadProducto: number;
}

// ? ------------------------- REPONSE CONSULTATIONS INTERFACE ------------------------------//
export interface ResponseVentaInterface {
  code: number;
  message: string;
  success: boolean;
  entity: VentaInterface | null;
}
