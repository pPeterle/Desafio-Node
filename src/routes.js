import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controller/SessionController';
import RecipientController from './app/controller/RecipientController';

import authMiddleware from './app/middlewares/auth';
import DeliverymanController from './app/controller/DeliverymanController';
import FileController from './app/controller/FileController';
import DeliveryController from './app/controller/DeliveryController';
import DeliverymanActionsController from './app/controller/DeliverymanActionsController';
import DeliveryProblemController from './app/controller/DeliveryProblemController';
import UserController from './app/controller/UserController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.get('/users', UserController.index);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.get('/deliveryman/:id/deliveries', DeliverymanActionsController.show);
routes.get(
  '/deliveryman/:id/deliveries-finished',
  DeliverymanActionsController.index
);
routes.put('/deliveryman/:id/retirar', DeliverymanActionsController.update1);
routes.put('/deliveryman/:id/entregar', DeliverymanActionsController.update2);

routes.post('/delivery', DeliveryController.store);
routes.get('/delivery', DeliveryController.index);
routes.delete('/delivery/:id', DeliveryController.delete);
routes.put('/delivery/:id', DeliveryController.update);

routes.post('/delivery/:id/problems', DeliveryProblemController.store);
routes.get('/delivery/:id/problems', DeliveryProblemController.index);
routes.delete('/delivery/:id/problems', DeliveryProblemController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
