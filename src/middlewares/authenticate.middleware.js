import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export function autentificateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, env.jwt_secret, (err, user) => {
        if (err) {
            return res.status(403);
        }
        req.user = user;
        next();
    });
}