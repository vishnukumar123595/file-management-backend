import express from 'express';
import { login, register } from '../controllers/auth.controller';
import { verifyToken, checkRole } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/login', login);
router.post('/register', verifyToken, checkRole('admin'), register); // optional

export default router;
