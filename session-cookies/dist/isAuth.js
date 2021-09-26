"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
require("dotenv/config");
function isAuth(req, res) {
    if (!req.session.userId) {
        res.send({ message: 'Not authenticated !' });
    }
    console.log(req.session);
    res.send({ message: 'Authenticated !' });
}
exports.isAuth = isAuth;
;
//# sourceMappingURL=isAuth.js.map