import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { TemporalModule } from '../temporal/temporal.module';
import { TemporalService } from '../temporal/temporal.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { OrderService } from './order.service';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [TemporalModule, RabbitMQModule, WebsocketModule],
  controllers: [OrderController],
  providers: [TemporalService, OrderService],
})
export class OrderModule {}
