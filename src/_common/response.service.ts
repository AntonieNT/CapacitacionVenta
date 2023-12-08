import { ApiProperty } from '@nestjs/swagger';
import { REQUEST } from '@nestjs/core';
import { Injectable, Inject } from '@nestjs/common';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { EventInterface } from './emit.interface';
import * as querystring from 'querystring';

@Injectable()
export class ResponseService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject('EMIT_SERVICE') private clientEmit: ClientProxy,
  ) {}
  // public succesMessageComplete(entity: any, message: string) {
  //   const contextToEmit: EventInterface = {
  //     code: 201,
  //     timestamp: new Date(),
  //     message: message,
  //     entity: entity,
  //     success: true,
  //     exception: false,
  //     host: this.request.headers.host,
  //     ip: this.request.ip,
  //     path: this.request.path,
  //     cookies: this.request.cookies,
  //     query: qs.stringify(this.request.query),
  //     userAgent: this.request.headers['user-agent'],
  //     params: querystring.stringify(this.request.params),
  //     method: this.request.method,
  //     body: this.request.body,
  //   };
  //   this.clientEmit.emit('new_exception', contextToEmit);
  //   return {
  //     code: 201,
  //     message: message,
  //     success: true,
  //     entity: entity,
  //   };
  // }
  public errorMessage(message: string) {
    const contextToEmit: EventInterface = {
      code: 201,
      timestamp: new Date(),
      message: message,
      entity: null,
      success: false,
      exception: false,
      host: this.request.headers.host,
      ip: this.request.ip,
      path: this.request.path,
      cookies: this.request.cookies,
      userAgent: this.request.headers['user-agent'],
      params: querystring.stringify(this.request.params),
      method: this.request.method,
      body: this.request.body,
    };
    this.clientEmit.emit('new_exception', contextToEmit);
    return {
      code: 201,
      message: message,
      success: false,
      entity: null,
    };
  }

  public succesMessage(entity: any, message: string) {
    const contextToEmit: EventInterface = {
      code: 201,
      message: message,
      entity: entity,
      success: true,
      exception: false,
      host: this.request.headers.host,
      timestamp: new Date(),
      ip: this.request.ip,
      path: this.request.path,
      cookies: this.request.cookies,
      userAgent: this.request.headers['user-agent'],
      params: querystring.stringify(this.request.params),
      method: this.request.method,
      body: this.request.body,
    };
    this.clientEmit.emit('new_exception', contextToEmit);
    return {
      code: 201,
      message: message,
      success: true,
      entity: entity,
    };
  }

  public succesInfo(message: string) {
    const contextToEmit: EventInterface = {
      code: 201,
      timestamp: new Date(),
      message: message,
      entity: null,
      success: true,
      exception: false,
      host: this.request.headers.host,
      ip: this.request.ip,
      path: this.request.path,
      cookies: this.request.cookies,
      userAgent: this.request.headers['user-agent'],
      params: querystring.stringify(this.request.params),
      method: this.request.method,
      body: this.request.body,
    };
    this.clientEmit.emit('new_exception', contextToEmit);
    return {
      code: 201,
      message: message,
      success: true,
      entity: null,
    };
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
