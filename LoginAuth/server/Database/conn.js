import mongoose from 'mongoose';
import ENV from '../config.js';

let memoryServer = null;

/**
 * Connect to MongoDB.
 *
 * - If ATLAS_URI is set, connect to it (the only supported path in production).
 * - Otherwise, in non-production, boot an in-memory MongoDB so the app runs
 *   with zero setup. Data is wiped on restart.
 */
async function connect() {
    mongoose.set('strictQuery', true);

    let uri = ENV.ATLAS_URI;

    if (!uri) {
        if (ENV.isProd) {
            throw new Error('ATLAS_URI is required in production.');
        }
        // Lazy import so this dev-only dependency is never required in prod.
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        uri = memoryServer.getUri();
        console.log('[db] ATLAS_URI not set — using in-memory MongoDB (data is not persisted).');
    }

    mongoose.connection.on('error', (err) => {
        console.error('[db] connection error:', err.message);
    });
    mongoose.connection.on('disconnected', () => {
        console.warn('[db] disconnected');
    });

    const db = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        autoIndex: !ENV.isProd, // build indexes automatically only outside prod
    });

    console.log('[db] connected');
    return db;
}

/** Cleanly tear down the connection (and in-memory server, if any). */
export async function disconnect() {
    await mongoose.connection.close();
    if (memoryServer) {
        await memoryServer.stop();
        memoryServer = null;
    }
}

export default connect;
