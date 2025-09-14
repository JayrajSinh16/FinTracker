import multer from 'multer';
import { storage, fileFilter } from '../config/multerConfig.js';

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

export default upload;
