import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Controller()
export class RabbitMQController {
  private readonly logger = new Logger(RabbitMQController.name)
  constructor(private readonly websocketGateway: WebsocketGateway) {}
  
  @MessagePattern('order_updates')
  handleOrderUpdates(@Payload() message: any) {
    this.logger.log('Received order update:', message);
    this.websocketGateway.triggerOrderUpdate(message);
  }
}
