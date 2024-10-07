import { proxyActivities, defineSignal, setHandler } from '@temporalio/workflow';
import type * as activities from './activities';

const { boilWater, brewCoffee, pushOrderUpdate, serveCoffee } = proxyActivities<typeof activities>({
  startToCloseTimeout: '300 seconds',
});

export const serveCoffeeSignal = defineSignal('serveCoffee');

export async function coffeeWorkflow(orderId: string, coffeeType: string, requests: string) {
  console.log(`Received order ${orderId} for ${coffeeType} with ${requests}`);
  
  let serveCoffeeReceived = false;
  setHandler(serveCoffeeSignal, () => {
    serveCoffeeReceived = true;
  });

  let result = await boilWater();
  await pushOrderUpdate(orderId, result);

  result = await brewCoffee();
  await pushOrderUpdate(orderId, result);

  console.log(`Waiting for "serveCoffee" signal for order ${orderId}...`);
  
  result = await new Promise<string>((resolve) => {
    setHandler(serveCoffeeSignal, async () => {
      serveCoffeeReceived = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      result = await serveCoffee();
      resolve(result);
    });
  });
  
  await pushOrderUpdate(orderId, result);
}
