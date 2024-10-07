import { Module } from '@nestjs/common';
import { TemporalModule } from './temporal/temporal.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { OrderModule } from './order/order.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [TemporalModule, OrderModule, RabbitMQModule, WebsocketModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
