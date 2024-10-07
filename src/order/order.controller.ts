import { Controller, Post, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { Logger } from '@nestjs/common';

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: { orderId: string; coffeeType: string, requests: string }) {
    this.logger.log('Received create order request', createOrderDto);
    const { orderId, coffeeType, requests } = createOrderDto;
    await this.orderService.createOrder(orderId, coffeeType, requests);
  }

  @Post(':orderId/serve')
  async serveCoffee(@Param('orderId') orderId: string) {
    this.logger.log(`Serving coffee for order: ${orderId}`);
    await this.orderService.serveCoffee(orderId);
  }
}
