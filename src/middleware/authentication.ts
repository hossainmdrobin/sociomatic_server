import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: string | jwt.JwtPayload;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token: string | undefined = req.cookies.accessToken;
    if (!token) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, process.env.ACCESS_SECRET as string, (err: jwt.VerifyErrors | null, user: string | jwt.JwtPayload | undefined) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    });
};