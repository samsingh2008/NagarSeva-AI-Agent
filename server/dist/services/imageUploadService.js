import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadImageToCloudinary = async (buffer, originalName) => {
    const hasCloudinaryConfig = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    if (!hasCloudinaryConfig) {
        const base64 = buffer.toString('base64');
        return `data:image/png;base64,${base64}`;
    }
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: 'nagarseva',
            public_id: `${Date.now()}-${originalName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`,
        }, (error, result) => {
            if (error || !result) {
                reject(new Error('Image upload failed'));
                return;
            }
            resolve(result.secure_url);
        });
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};
//# sourceMappingURL=imageUploadService.js.map