import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
// import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { globalResponse } from 'src/_common/response.service';
import { FindProductoDto } from './dto/find-productos.dto';
import { CreateProductoDto } from './dto/create-producto.dto';
@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  // ? ------------------------- FIND ALL PRODUCTS ------------------------------//
  @ApiOperation({
    summary: 'Return all productos',
  })
  @ApiResponse({
    status: 201,
    description: 'Return productos',
    isArray: false,
    type: globalResponse,
  })
  @Get()
  findAll() {
    return this.productosService.findAll();
  }
  // ? ------------------------- FIND ONE PRODUCT ------------------------------//
  @ApiOperation({
    summary: 'Return producto',
  })
  @ApiResponse({
    status: 201,
    description: 'Return producto',
    isArray: false,
    type: globalResponse,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }

  // ? ------------------------- FIND ALL CONSULTATIONS ------------------------------//
  @ApiOperation({
    summary: 'Return productos',
  })
  @ApiResponse({
    status: 201,
    description: 'Return productos',
    isArray: false,
    type: globalResponse,
  })
  @Post('get-Products')
  generate(@Body() findProductoDto: FindProductoDto) {
    return this.productosService.findAllProductos(findProductoDto);
  }
}
