import 'dotenv/config';

// Middleware that checks  tokens
export function isAuth(req, res) {
    if (!req.session.userId) {
        res.send({ message: 'Not authenticated !' })
    }
    console.log(req.session)
    res.send({ message: 'Authenticated !' })
};
