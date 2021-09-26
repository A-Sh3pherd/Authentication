import connectRedis from 'connect-redis';
import cors from 'cors';
import 'dotenv/config'; // making sure .env will work
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import { createConnection, getRepository } from 'typeorm';
import { isAuth } from './isAuth';
import { User } from './models/User';

(async () => {
    // Db
    await createConnection();
    // Express
    const app = express();
    app.use(express.json());
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
    app.get('/', (req, res) => {
        return isAuth(req, res);
    })

    // Signin
    app.get('/login', async (req, res) => {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password })
        if (!user) {
            // no user
            return res.send('No user')
        }
        // @ts-ignore | don't recognise userId
        req.session.userId = user.id;
        return res.send({ user });
    })

    // Signup
    app.post('/signup', async (req, res) => {
        const { username, password } = req.body;
        const repo = getRepository(User);
        try {
            const user = await repo.create({ username, password }).save();
            console.log(user)
            res.send({ user })
            // const user = await repo.findOne({ username })
            // if (user) return res.send('User already exist.');
        } catch (e) {
            console.log(e);
            res.send(e)
        }

    })

    app.post('/logout', (req, res) => {
        return new Promise((resolve) =>
            req.session.destroy(err => {
                if (err) {
                    console.log(err);
                    res.send({ message: err })
                    return resolve(false)
                }
                res.clearCookie(process.env.COOKIE_NAME!) // Clearing the cookie
                res.send({ message: 'Cookie removed' })
                return resolve(true)
            }));
    })
    // App Connection
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Server up on port ${ port }`);
    });

} // END
)()
    .catch(e => {
        console.log(e)
    })
    ;