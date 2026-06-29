import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

import ENV from './config.js';
import connect, { disconnect } from './Database/conn.js';
import router from './router/route.js';
import { apiLimiter } from './middleware/rateLimiters.js';

const app = express();

/** Trust the first proxy hop in production (correct client IPs for rate limiting). */
app.set('trust proxy', ENV.isProd ? 1 : false);
app.disable('x-powered-by');

/** Security headers */
app.use(helmet());

/** CORS — only allow configured origins */
app.use(
    cors({
        origin(origin, callback) {
            // Allow non-browser clients (curl, server-to-server) with no Origin.
            if (!origin || ENV.ALLOWED_ORIGINS.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
);

/** Body parsing with a tight size limit */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/** Strip MongoDB operators ($, .) from inputs to block NoSQL injection.
 *  Mutates objects in place (no req.query reassignment) for Express compatibility. */
app.use((req, _res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.query) mongoSanitize.sanitize(req.query);
    next();
});

/** Request logging (quiet during tests) */
if (ENV.NODE_ENV !== 'test') {
    app.use(morgan('tiny'));
}

/** Health check */
app.get('/', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'LoginAuth API' });
});

/** API routes (baseline rate limit applied to everything under /api) */
app.use('/api', apiLimiter, router);

/** 404 for anything unmatched */
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

/** Central error handler — last middleware. */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    // Validation / client-safe errors carry a status + expose flag.
    let status = err.status || err.statusCode || 500;
    let message = err.expose ? err.message : 'Something went wrong.';

    if (err.name === 'ValidationError') {
        status = 400;
        message = Object.values(err.errors).map((e) => e.message).join(', ');
    } else if (err.code === 11000) {
        status = 409;
        message = 'A record with that value already exists.';
    } else if (err.message === 'Not allowed by CORS') {
        status = 403;
        message = 'Origin not allowed.';
    }

    if (status >= 500) {
        console.error('[error]', err);
    }
    res.status(status).json({ error: message });
});

/** Boot */
let server;
connect()
    .then(() => {
        server = app.listen(ENV.PORT, () => {
            console.log(`Server running at http://localhost:${ENV.PORT}`);
        });
    })
    .catch((error) => {
        console.error('Invalid database connection:', error.message);
        process.exit(1);
    });

/** Graceful shutdown */
async function shutdown(signal) {
    console.log(`\n${signal} received — shutting down...`);
    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }
    await disconnect().catch(() => {});
    process.exit(0);
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default app;
