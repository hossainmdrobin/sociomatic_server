import { UserPayload } from '../UserPayload';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      files?: Express.Multer.File[];
    }
  }
}
