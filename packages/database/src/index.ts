import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Enable WebSocket connection caching for Edge Environment compatibility
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL || '';

export const db = connectionString ? drizzle(neon(connectionString), { schema }) : null as any;

export * from './schema';
export * from 'drizzle-orm';
