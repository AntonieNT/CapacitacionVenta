import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
@Catch()
export class PersonalizedResponseService {
  catch(error: any) {
    switch (error.status) {
      case 401:
        return {
          code: 401,
          message: error.message,
          success: false,
          entity: null,
        };

        break;
      case 404:
        return {
          code: 404,
          message: error.message,
          success: false,
          entity: null,
        };
        break;
      case 409:
        return {
          code: 409,
          message: error.message,
          success: false,
          entity: null,
        };
        break;
      default:
        switch (error.code) {
          case '22P02':
            return {
              code: 400,
              message: 'El id no corresponde al fomarto UUID',
              success: false,
              entity: null,
            };
            break;
          default:
            throw new HttpException(
              `Error aun no clasificado`,
              HttpStatus.NOT_IMPLEMENTED,
            );
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
