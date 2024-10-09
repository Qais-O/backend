import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';

const TEMPORAL_ADDRESS = process.env.TEMPORAL_ADDRESS || 'localhost:7233';

async function runWorkers() {
  const connection = await NativeConnection.connect({
    address: TEMPORAL_ADDRESS,
  });
  
  const worker = await Worker.create({
    connection,
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
