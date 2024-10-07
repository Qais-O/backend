import { Worker } from '@temporalio/worker';
import * as activities from './activities';

async function runWorkers() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflow'),
    taskQueue: 'coffee-making-tasks',
    activities,
  });

  await worker.run();
  console.log('Workers are running...');
}

runWorkers().catch((err) => {
  console.error(err);
  process.exit(1);
});
