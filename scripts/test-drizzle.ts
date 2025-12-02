import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/db/schema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
console.log('Reading env from:', envPath);

try {
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        for (const line of envConfig.split('\n')) {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
                if (key && value && !key.startsWith('#')) {
                    process.env[key] = value;
                }
            }
        }
    } else {
        console.error('.env.local file not found');
    }
} catch (e) {
    console.error('Error reading .env.local:', e);
}

const connectionString = process.env.DATABASE_URL;
console.log('DATABASE_URL set:', !!connectionString);

if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const pool = new Pool({ connectionString });
const db = drizzle(pool, { schema });

async function main() {
    try {
        console.log('Connecting to database...');
        const users = await db.select().from(schema.users).limit(1);
        console.log('Successfully connected to database!');
        console.log('Query result:', users);
    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        await pool.end();
    }
}

main();
