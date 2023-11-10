import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SalesService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Sales')
@Controller('Sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.salesService.create(createVentaDto);
  }

  // @Get()
  // findAll() {
  //   return this.salesService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto) {
  //   return this.salesService.update(+id, updateVentaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.salesService.remove(+id);
  // }
}
