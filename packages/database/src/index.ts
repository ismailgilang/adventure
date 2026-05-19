import * as serverless from '@neondatabase/serverless';
import * as neonHttp from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Helper to safely extract exports from CommonJS or ESM imports in edge bundlers
const getExport = (module: any, key: string) => {
  if (!module) return undefined;
  if (module[key] !== undefined) return module[key];
  if (module.default && module.default[key] !== undefined) return module.default[key];
  return undefined;
};

const neon = getExport(serverless, 'neon');
const neonConfig = getExport(serverless, 'neonConfig');
const drizzle = getExport(neonHttp, 'drizzle');

if (neonConfig) {
  neonConfig.fetchConnectionCache = true;
}

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
