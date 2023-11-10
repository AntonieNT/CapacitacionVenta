import { PartialType } from '@nestjs/swagger';
import { CreateproductDto } from './create-product.dto';

export class UpdateproductDto extends PartialType(CreateproductDto) {}
