import multer, { MulterError } from 'multer';
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
const uploadSingle = (req, res, next) => {
    upload.single('image')(req, res, (error) => {
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
//# sourceMappingURL=upload.js.map