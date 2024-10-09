import { Injectable, Logger } from '@nestjs/common';
import { Connection, WorkflowClient } from '@temporalio/client';
import { serveCoffeeSignal, coffeeWorkflow } from './worker/workflow';

const TEMPORAL_ADDRESS = process.env.TEMPORAL_ADDRESS || 'localhost:7233';

@Injectable()
export class TemporalService {
  private readonly logger = new Logger(TemporalService.name);
  private client: WorkflowClient;

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    this.client = new WorkflowClient({
      connection: await Connection.connect({
        address: TEMPORAL_ADDRESS,
      }),
    });
  }

  async startWorkflow(orderId: string, coffeeType: string, requests: string) {
    const workflowId = `coffeeWorkflow-${orderId}`;
    const handle = await this.client.start(coffeeWorkflow, {
        args: [orderId, coffeeType, requests],
        workflowId: workflowId,
        taskQueue: 'coffee-making-tasks'
    });

    this.logger.log(`Started workflow for order ${orderId} with handle ${handle.workflowId}`);
  }
  
  async signalServeCoffee(orderId: string): Promise<void> {
    const workflowId = `coffeeWorkflow-${orderId}`;
    const workflowHandle = this.client.getHandle(workflowId);
    await workflowHandle.signal(serveCoffeeSignal);
    this.logger.log(`Signaled to serve coffee for order ${orderId}`);
  }
}
