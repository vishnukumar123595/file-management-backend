import express from 'express';
import { getAllUsers, updateUser, deleteUser } from '../controllers/user.controller';
import { verifyToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', verifyToken, checkRole('admin'), getAllUsers);
router.put('/:id', verifyToken, checkRole('admin'), updateUser);
router.delete('/:id', verifyToken, checkRole('admin'), deleteUser);

export default router;
