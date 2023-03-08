import { v4 as uuid } from 'uuid';

export const filename = (
  req: Express.Request,
  file: Express.Multer.File,
  callback,
) => {
  if (!file) return callback(new Error('File is empty'), false);
  const ext = file.originalname.split('.').pop();
  const filename = `${uuid()}.${ext}`;
  callback(null, filename);
};
