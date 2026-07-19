import multer, { MulterError } from 'multer';
import { Request, Response, NextFunction } from 'express';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
      return;
    }

    cb(null, true);
  },
});

const uploadSingle = (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, (error: unknown) => {
    if (error instanceof MulterError) {
      return res.status(400).json({ success: false, message: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    next();
  });
};

export default uploadSingle;
