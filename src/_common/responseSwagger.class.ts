import { ApiProperty } from '@nestjs/swagger';

export class ResponseSwagger {
  @ApiProperty()
  code: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  success: boolean;

  @ApiProperty({ isArray: true })
  entity: any;
}
