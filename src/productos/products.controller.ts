import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
// import { CreateproductDto } from './dto/create-product.dto';
import { UpdateproductDto } from './dto/update-product.dto';
import { ApiAcceptedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { globalResponse } from 'src/_common/response.service';
import { FindproductDto } from './dto/find-product.dto';
import { CreateproductDto } from './dto/create-product.dto';
@ApiTags('products')
@Controller('products')
export class productsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post()
  create(@Body() createproductDto: CreateproductDto) {
    return this.productsService.create(createproductDto);
  }

  // ? ------------------------- FIND ALL PRODUCTS ------------------------------//
  @ApiOperation({
    summary: 'Return all products',
  })
  @ApiResponse({
    status: 201,
    description: 'Return products',
    isArray: false,
    type: globalResponse,
  })
  @Get()
  findAll() {
    return this.productsService.findAll();
  }
  // ? ------------------------- FIND ONE PRODUCT ------------------------------//
  @ApiOperation({
    summary: 'Return product',
  })
  @ApiResponse({
    status: 201,
    description: 'Return product',
    isArray: false,
    type: globalResponse,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
    console.log('termine de hacer esto');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateproductDto: UpdateproductDto) {
    return this.productsService.update(+id, updateproductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // ? ------------------------- FIND ALL CONSULTATIONS ------------------------------//
  @ApiOperation({
    summary: 'Return products',
  })
  @ApiResponse({
    status: 201,
    description: 'Return products',
    isArray: false,
    type: globalResponse,
  })
  @Post('get-Products')
  generate(@Body() findproductDto: FindproductDto) {
    return this.productsService.findAllproducts(findproductDto);
  }
}
