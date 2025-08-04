import express from 'express';
import { createFolder, deleteFolder, getFolders, searchFolders } from '../controllers/folder.controller';
import { verifyToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', verifyToken, checkRole('admin'), createFolder);
router.get('/', verifyToken, getFolders);
router.delete('/:id', verifyToken, checkRole('admin'), deleteFolder);
router.get('/search', verifyToken, searchFolders);

export default router;
