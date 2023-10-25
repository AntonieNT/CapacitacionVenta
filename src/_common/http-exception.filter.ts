import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const msg =
      exception instanceof HttpException ? exception.getResponse() : exception;
    switch (status) {
      case 400:
        response.status(200).json({
          code: status,
          success: false,
          entity: null,
          message: 'Error de respueta: ' + msg.message[0],
          timestamp: new Date().toISOString(),
          path: request.url,
        });

        break;
      case 401:
        response.status(200).json({
          code: status,
          success: false,
          entity: null,
          message: 'No autorizado',
          timestamp: new Date().toISOString(),
          path: request.url,
        });

        break;

      case 403:
        response.status(200).json({
          code: status,
          success: false,
          entity: null,
          message: 'Prohibido',
          timestamp: new Date().toISOString(),
          path: request.url,
        });

        break;
      case 404:
        response.status(200).json({
          code: status,
          success: false,
          entity: null,
          message: 'No se encontro',
          timestamp: new Date().toISOString(),
          path: request.url,
        });

        break;
      default:
        response.status(200).json({
          code: status,
          success: false,
          entity: null,
          message: 'Error aun no clasificado',
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;
    }
  }
}
