import { Module } from '@nestjs/common';
import { WebsocketModule } from '../websocket/websocket.module';
import { RabbitMQController } from './rabbitmq.controller';

@Module({
  imports: [WebsocketModule],
  exports: [],
  controllers: [RabbitMQController],
})
export class RabbitMQModule {}
