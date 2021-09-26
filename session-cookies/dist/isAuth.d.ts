import 'dotenv/config';
import { Request, Response } from 'express';
import { Session } from 'express-session';
declare type MyContext = {
    req: Request & {
        session: Session & {
            userId: number;
        };
    };
    res: Response;
    next: any;
};
export declare const isAuth: (req: any, next: any) => MyContext;
export {};
