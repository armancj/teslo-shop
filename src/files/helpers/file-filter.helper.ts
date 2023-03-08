export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback,
) => {
  console.log({ file });

  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg'];

  if (!validExtensions.includes(fileExtension)) return callback(null, false);

  callback(null, true);
};
