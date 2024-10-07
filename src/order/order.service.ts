import { Injectable, Logger } from '@nestjs/common';
import { TemporalService } from '../temporal/temporal.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly temporalService: TemporalService,
  ) {}

  async createOrder(orderId: string, coffeeType: string, requests: string): Promise<void> {
    this.logger.log('Creating order', { orderId, coffeeType });
    await this.temporalService.startWorkflow(orderId, coffeeType, requests);
  }

  async serveCoffee(orderId: string): Promise<void> {
    this.logger.log(`Serving coffee for order: ${orderId}`);
    await this.temporalService.signalServeCoffee(orderId);
  }
}
