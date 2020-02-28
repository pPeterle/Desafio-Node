import './boostrap';
import express from 'express';
import rotues from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(rotues);
  }
}

export default new App().server;
