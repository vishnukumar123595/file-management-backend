import express from 'express';
import { createFile, deleteFile, deleteFilePermanently, getFiles, restoreFile, shareFile } from '../controllers/file.controller';
import { verifyToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', verifyToken, checkRole('admin'), createFile);
router.get('/', verifyToken, getFiles);
router.delete('/:id', verifyToken, checkRole('admin'), deleteFile);
router.post('/share', verifyToken, checkRole('admin'), shareFile);
router.post('/:id/restore', verifyToken, checkRole('admin'), restoreFile);
router.delete('/:id/permanent', verifyToken, checkRole('admin'), deleteFilePermanently);

export default router;
