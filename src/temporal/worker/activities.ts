import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'

const client = ClientProxyFactory.create({
  transport: Transport.RMQ,
  options: {
    urls: [RABBITMQ_URL],
    queue: 'order_updates',
    queueOptions: {
      durable: false,
    },
  },
});
const logger = new Logger('Worker')

export async function boilWater(): Promise<string>  {
  logger.log('Boiling water...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  return 'Water boiled.';
}
  
export async function brewCoffee(): Promise<string>  {
  logger.log('Brewing coffee...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  return 'Coffee brewed.';
}

export async function serveCoffee(): Promise<string>  {
  logger.log('Serving coffee...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  return 'Coffee served.';
}

export async function pushOrderUpdate(orderId: string, coffeeType: string, requests: string, status: string): Promise<void> {
  logger.log('Pushing order updates to queue...');
  client.emit('order_updates', { orderId, coffeeType, requests, status });
}