import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class TemporalWorkerService implements OnModuleInit {
  private readonly logger = new Logger(TemporalWorkerService.name);

  async onModuleInit() {
    this.startWorker();
  }

  private startWorker() {
    const workerProcess = spawn('node', ['worker.js'], {
      stdio: 'inherit',
      shell: true,
    });

    workerProcess.on('error', (err) => {
      this.logger.error('Failed to start worker:', err);
    });

    workerProcess.on('exit', (code) => {
      this.logger.log(`Worker exited with code ${code}`);
    });

    this.logger.log('Temporal worker has been started.');
  }
}
