import { ApiProperty } from '@nestjs/swagger';

export class ResponseService {
  public errorMessage(message: string) {
    return {
      code: 201,
      message: message,
      success: false,
      entity: null,
    };
  }

  public succesMessage(entity: any, message: string) {
    return {
      code: 201,
      message: message,
      success: true,
      entity: entity,
    };
  }

  public succesInfo(message: string) {
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
