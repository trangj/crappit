// uploading to aws
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});
const s3 = new AWS.S3({ apiVersion: 'latest' });
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

const uploadFile = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 10485760,
  },
  fileFilter: (req, file, cb) => {
    if (SUPPORTED_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unaccepted file format'));
    }
  },
}).single('file');

export const upload = (req: Request, res: Response, next: NextFunction) => {
  uploadFile(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ status: { text: err.message, severity: 'error' } });
    } if (err) {
      return res
        .status(400)
        .json({ status: { text: err.message, severity: 'error' } });
    }
    return next();
  });
};

export const deleteFile = (Key: string) => {
  s3.deleteObject(
    {
      Bucket: process.env.S3_BUCKET,
      Key,
    },
    (err) => {
      if (err) throw Error(err.message);
    },
  );
};
