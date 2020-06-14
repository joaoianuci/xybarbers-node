import 'dotenv/config';

import express from 'express';
import path from 'path';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import BullBoard from 'bull-board';
import Queue from './app/lib/Queue';

import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.bullBoard();
    this.sentry();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }

  bullBoard() {
    BullBoard.setQueues(Queue.queues.map(queue => queue.bull));
    this.server.use('/admin/queues', BullBoard.UI);
  }

  sentry() {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(Sentry.Handlers.errorHandler());
  }
}

export default new App().server;
