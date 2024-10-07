import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3000, { cors: { origin: '*' } })
export class WebsocketGateway implements OnModuleInit, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() 
  server: Server | null = null;
  private readonly logger = new Logger(WebsocketGateway.name);

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected!')
    })
  }

  afterInit(server: Server) {
    this.server = server;
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('orderUpdates')
  onOrderUpdates(@MessageBody() data:any) {
    console.log(data);
    this.server.emit('onOrderUpdates', { orderId: data.orderId })
  }

  async triggerOrderUpdate(data: any) {
    this.server.emit('onOrderUpdates', data);
  }
}
