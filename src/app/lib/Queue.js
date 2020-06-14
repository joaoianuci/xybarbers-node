import Bull from 'bull';
import * as Sentry from '@sentry/node';
import redisConfig from '../../config/redis';

import * as jobs from '../jobs';

class Queue {
  constructor() {
    this.queues = {};

    this.init();
    this.sentry();
  }

  init() {
    this.queues = Object.values(jobs).map(job => ({
      bull: new Bull(job.key, redisConfig),
      name: job.key,
      handle: job.handle,
      options: job.options,
    }));
  }

  add(name, data) {
    const queueFilter = this.queues.find(queue => queue.name === name);

    return queueFilter.bull.add(data, queueFilter.options);
  }

  process() {
    return this.queues.forEach(queue => {
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (job, err) => {
        Sentry.configureScope(scope => {
          scope.setUser({ job: job.queue.name });
        });
        Sentry.captureException(err);
      });
    });
  }

  sentry() {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    Sentry.Handlers.requestHandler();
    Sentry.Handlers.errorHandler();
  }
}

export default new Queue();
