import { ApiProperty } from '@nestjs/swagger';
import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { EventInterface } from './emit.interface';
import * as querystring from 'querystring';
@Injectable()
export class PersonalizedResponseService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject('EMIT_SERVICE') private clientEmit: ClientProxy,
  ) {}
  catch(error: any) {
    const contextToEmit: EventInterface = {
      code: error.status,
      timestamp: new Date(),
      entity: null,
      success: false,
      message: '',
      exception: true,
      host: this.request.headers.host,
      ip: this.request.ip,
      path: this.request.path,
      cookies: this.request.cookies,
      userAgent: this.request.headers['user-agent'],
      params: querystring.stringify(this.request.params),
      method: this.request.method,
      body: this.request.body,
    };
    switch (error.status) {
      case 100:
        contextToEmit.message = !error.message ? 'Continue' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 101:
        contextToEmit.message = !error.message
          ? 'Switching Protocols'
          : error.message;
        contextToEmit.message = !error.message ? 'Continue' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 102:
        contextToEmit.message = !error.message ? 'Processing' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 103:
        contextToEmit.message = !error.message ? 'Early Hints' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 200:
        contextToEmit.message = !error.message ? 'OK' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 202:
        contextToEmit.message = !error.message ? 'Accepted' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 203:
        contextToEmit.message = !error.message
          ? 'Non-Authoritative Information'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 204:
        contextToEmit.message = !error.message ? 'No Content' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 205:
        contextToEmit.message = !error.message
          ? 'Reset Content'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 206:
        contextToEmit.message = !error.message
          ? 'Partial Content'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 207:
        contextToEmit.message = !error.message ? 'Multi-Status' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 208:
        contextToEmit.message = !error.message
          ? 'Already Reported'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 226:
        contextToEmit.message = !error.message ? 'IM Used' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 300:
        contextToEmit.message = !error.message
          ? 'Multiple Choices'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 301:
        contextToEmit.message = !error.message
          ? 'Moved Permanently'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 302:
        contextToEmit.message = !error.message ? 'Found' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 303:
        contextToEmit.message = !error.message ? 'See Other' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 304:
        contextToEmit.message = !error.message ? 'Not Modified' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 305:
        contextToEmit.message = !error.message ? 'Use Proxy' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 307:
        contextToEmit.message = !error.message
          ? 'Temporary Redirect'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 308:
        contextToEmit.message = !error.message
          ? 'Permanent Redirect'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 400:
        contextToEmit.message = !error.message
          ? 'Error de respueta'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 401:
        contextToEmit.message = !error.message
          ? 'No autorizado'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      case 402:
        contextToEmit.message = !error.message
          ? 'Payment Requiered'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 403:
        contextToEmit.message = !error.message ? 'Prohibido' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 404:
        contextToEmit.message = !error.message
          ? 'No se encontro'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 405:
        contextToEmit.message = !error.message
          ? 'Method Not Allowed'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 406:
        contextToEmit.message = !error.message
          ? 'Not Acceptable'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 407:
        contextToEmit.message = !error.message
          ? 'Proxy Authentication Requiered'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 408:
        contextToEmit.message = !error.message
          ? 'Request TimeOut'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 409:
        contextToEmit.message = !error.message ? 'Conflict' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 410:
        contextToEmit.message = !error.message ? 'Gone' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 411:
        contextToEmit.message = !error.message
          ? 'Length Requiered'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 412:
        contextToEmit.message = !error.message
          ? 'Precondition Failed'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 413:
        contextToEmit.message = !error.message
          ? 'Payload To Large'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 414:
        contextToEmit.message = !error.message
          ? 'Request-URI Too Long'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 416:
        contextToEmit.message = !error.message
          ? 'Unsupported Media Type'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 417:
        contextToEmit.message = !error.message
          ? 'Request Range Not Satisfiable'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 418:
        contextToEmit.message = !error.message
          ? 'Expectation Failed'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 419:
        contextToEmit.message = !error.message ? 'Im a teapot' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 420:
        contextToEmit.message = !error.message
          ? 'Enchance Your Calm'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 421:
        contextToEmit.message = !error.message
          ? 'Misdirected Request'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 422:
        contextToEmit.message = !error.message
          ? 'Unprocessable Entity'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 423:
        contextToEmit.message = !error.message ? 'Locked' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 424:
        contextToEmit.message = !error.message
          ? 'Failed Dependency'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 425:
        contextToEmit.message = !error.message ? 'Too Early' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 426:
        contextToEmit.message = !error.message
          ? 'Upgrade Requiered'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 428:
        contextToEmit.message = !error.message
          ? 'Precondition Required'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 429:
        contextToEmit.message = !error.message
          ? 'Too Many Request'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 431:
        contextToEmit.message = !error.message
          ? 'Request Header Fields Too Large'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 444:
        contextToEmit.message = !error.message ? 'No Response' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 450:
        contextToEmit.message = !error.message
          ? 'Blocked by Windows Parental Controls'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 451:
        contextToEmit.message = !error.message
          ? 'Unavailable For Legal Reasons'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 497:
        contextToEmit.message = !error.message
          ? 'HTTP Request Sent to HTTPS port'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 498:
        contextToEmit.message = !error.message
          ? 'Token expired/invalid'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 499:
        contextToEmit.message = !error.message
          ? 'Client Closed Request'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 501:
        contextToEmit.message = !error.message
          ? 'Not Implemented'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 502:
        contextToEmit.message = !error.message ? 'Bad Gateway' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 503:
        contextToEmit.message = !error.message
          ? 'Service Unavalible'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 504:
        contextToEmit.message = !error.message
          ? 'Gateway Timeout'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 506:
        contextToEmit.message = !error.message
          ? 'Variant Also Negotiates'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 507:
        contextToEmit.message = !error.message
          ? 'Insufficient Storage'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 508:
        contextToEmit.message = !error.message
          ? 'Loop Detected'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 509:
        contextToEmit.message = !error.message
          ? 'Bandwidth Limit Exceeded'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 510:
        contextToEmit.message = !error.message ? 'Not Extended' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 511:
        contextToEmit.message = !error.message
          ? 'Network Auuthentication Requiered'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 521:
        contextToEmit.message = !error.message
          ? 'Web Server Is Down'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 522:
        contextToEmit.message = !error.message
          ? 'Connection Timed Out'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 523:
        contextToEmit.message = !error.message
          ? 'Origin Is Unreachable'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 525:
        contextToEmit.message = !error.message
          ? 'SSL Handshake Failed'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 530:
        contextToEmit.message = !error.message ? 'Site Frozen' : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;

      case 599:
        contextToEmit.message = !error.message
          ? 'Network Connect Timeout Error'
          : error.message;
        this.clientEmit.emit('new_exception', contextToEmit);
        return {
          code: contextToEmit.code,
          message: contextToEmit.message,
          success: false,
          entity: null,
        };
        break;
      default:
        switch (error.code) {
          case '22P02':
            contextToEmit.code = 400;
            contextToEmit.message = !error.message
              ? 'El id no corresponde al fomarto UUID'
              : error.message;
            this.clientEmit.emit('new_exception', contextToEmit);
            return {
              code: contextToEmit.code,
              message: contextToEmit.message,
              success: false,
              entity: null,
            };
            break;
          default:
            contextToEmit.code = 500;
            contextToEmit.message = !error.message
              ? 'Error aun no clasificado'
              : error.message;
            this.clientEmit.emit('new_exception', contextToEmit);
            return {
              code: contextToEmit.code,
              message: contextToEmit.message,
              success: false,
              entity: null,
            };
            break;
        }
        break;
    }
  }
}
export class globalResponse {
  @ApiProperty()
  code: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  entity: any;
}
