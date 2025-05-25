
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;
    console.log(process.env.JWT_SECRET);

  if (!token) {
     res.status(401).json({ message: 'No token provided' });
     return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    console.log(decoded);
    

    req.user = decoded;
    next();
  } catch (err) {
      console.error(err);
     res.status(403).json({ message: 'Invalid token' });
     return;
  }
};

