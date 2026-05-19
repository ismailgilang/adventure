import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Enable WebSocket connection caching for Edge Environment compatibility
neonConfig.fetchConnectionCache = true;

let _db: any = null;

function getDbInstance() {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not defined!");
    }
    _db = drizzle(neon(connectionString), { schema });
  }
  return _db;
}

// Export a Proxy that intercepts all database operations and delegates to the dynamically initialized Drizzle client
export const db = new Proxy({} as any, {
  get(target, prop, receiver) {
    const instance = getDbInstance();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});

export * from './schema';
export * from 'drizzle-orm';
