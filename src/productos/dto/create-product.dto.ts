import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateproductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt()
  salePrice: number;

  @ApiProperty()
  @IsInt()
  purchaseCost: number;

  @ApiProperty()
  @IsInt()
  stock: number;

  @ApiProperty()
  @IsString()
  code: string;
}
