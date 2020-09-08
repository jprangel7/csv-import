import { Router } from 'express';
import multer from 'multer';

import ImportCSVService from '../services/ImportCSVService';

import uploadConfig from '../config/upload';

const importCSVRouter = Router();

const upload = multer(uploadConfig);

importCSVRouter.post(
    '/importCSV',
    upload.single('TOTVS'),
    async (request, response) => {
      const importCSV = new ImportCSVService();
  
      const data = await importCSV.execute(request.file.path);
  
      return response.status(201).json(data);
    },
  );

export default importCSVRouter;