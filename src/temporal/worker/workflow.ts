import { proxyActivities, defineSignal, setHandler } from '@temporalio/workflow';
import type * as activities from './activities';

const { boilWater, brewCoffee, pushOrderUpdate, serveCoffee } = proxyActivities<typeof activities>({
  startToCloseTimeout: '300 seconds',
});

export const serveCoffeeSignal = defineSignal('serveCoffee');

export async function coffeeWorkflow(orderId: string, coffeeType: string, requests: string) {
  console.log(`Received order ${orderId} for ${coffeeType} with ${requests}`);
  await pushOrderUpdate(orderId, coffeeType, requests, 'Order created.')
  
  let serveCoffeeReceived = false;
  setHandler(serveCoffeeSignal, () => {
    serveCoffeeReceived = true;
  });

  let status = await boilWater();
  await pushOrderUpdate(orderId, coffeeType, requests, status);

  status = await brewCoffee();
  await pushOrderUpdate(orderId, coffeeType, requests, status);

  console.log(`Waiting for "serveCoffee" signal for order ${orderId}...`);
  
  status = await new Promise<string>((resolve) => {
    setHandler(serveCoffeeSignal, async () => {
      serveCoffeeReceived = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      status = await serveCoffee();
      resolve(status);
    });
  });
  
  await pushOrderUpdate(orderId, coffeeType, requests, status);
}
