"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const ioredis_1 = __importDefault(require("ioredis"));
const typeorm_1 = require("typeorm");
const isAuth_1 = require("./isAuth");
const User_1 = require("./models/User");
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, typeorm_1.createConnection)();
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const redis = new ioredis_1.default();
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    app.use((0, cors_1.default)({
        origin: process.env.ORIGIN_URL || 'http://localhost:3000',
        credentials: true
    }));
    app.use((0, express_session_1.default)({
        name: process.env.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
        },
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false
    }));
    app.get('/', (req, res) => {
        return (0, isAuth_1.isAuth)(req, res);
    });
    app.get('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = req.body;
        const user = yield User_1.User.findOne({ username, password });
        if (!user) {
            return res.send('No user');
        }
        req.session.userId = user.id;
        return res.send({ user });
    }));
    app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = req.body;
        const repo = (0, typeorm_1.getRepository)(User_1.User);
        try {
            const user = yield repo.create({ username, password }).save();
            console.log(user);
            res.send(user);
        }
        catch (e) {
            console.log(e);
        }
    }));
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Server up on port ${port}`);
    });
}))()
    .catch(e => {
    console.log(e);
});
//# sourceMappingURL=index.js.map