import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'dotenv/config'; // making sure .env will work
import { isAuth } from './isAuth';

(async () => {
    // Express
    const app = express();
    // Redis
    const redis = new Redis();
    const RedisStore = connectRedis(session)

    app.use(cors({
        origin: process.env.ORIGIN_URL || 'http://localhost:3000', // Either supply an origin, or localhost:3000
        credentials: true
    }));
    // Session
    app.use(session({
        name: process.env.COOKIE_NAME, // cookie name
        store: new RedisStore({
            client: redis, // where we store the cookie
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 Day
            secure: false, // cookie will only work in https
            httpOnly: true, // Set a cookie only on http 
            sameSite: 'lax', // csrf
        },
        secret: process.env.SESSION_SECRET!, // Session Secret || Make sure you have it on your .env file (!)
        saveUninitialized: false, // save uninitialized sessions?
        resave: false // resave existing ?
    }));

    // check if authenticated
    app.use('/', (req, next) => {
        isAuth(req, next);
        // If were here, it means we are authenticated
        console.log('Authenticated!')
    })
    // App Connection
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Server up on port ${ port }`);
    });

} // END
)();