import jwt from 'jsonwebtoken';
import ENV from '../config.js';

/**
 * Verify the Bearer token on the Authorization header and attach the decoded
 * payload to req.user. Rejects with 401 on any problem.
 */
export default function Auth(req, res, next) {
    try {
        const header = req.headers.authorization || '';
        const [scheme, token] = header.split(' ');

        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({ error: 'Authentication failed: missing bearer token.' });
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET, {
            algorithms: ['HS256'],
            issuer: ENV.JWT_ISSUER,
            audience: ENV.JWT_AUDIENCE,
        });

        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed: invalid or expired token.' });
    }
}
