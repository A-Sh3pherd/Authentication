import 'dotenv/config';
import { Request, Response } from 'express';
import { Session } from 'express-session';

type MyContext = {
    req: Request & { session: Session & { userId: number } };
    res: Response;
    next: any

}
// Middleware that checks  tokens
export const isAuth = (req, next): MyContext => {
    if (!req.session.userId) {
        throw new Error('Not authenticated')
    }
    return next();
};
