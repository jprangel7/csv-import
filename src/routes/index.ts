import { Router } from 'express';

import importCSVRouter from './importCSV.routes';

const routes = Router();

routes.use('/import', importCSVRouter);

export default routes;
