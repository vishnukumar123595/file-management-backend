import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
function getJwtSecret(): string {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined in environment variables");
  return JWT_SECRET;
}


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const checkRole = (role: 'admin' | 'user') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user?.role !== role) return res.status(403).json({ message: 'Access denied' });
    next();
  };
};
