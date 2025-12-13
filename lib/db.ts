import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Support both Prisma Postgres (accelerateUrl) and standard PostgreSQL (adapter)
const databaseUrl = process.env.DATABASE_URL || '';
const isPrismaPostgres = databaseUrl.startsWith('prisma+postgres://');

function createPrismaClient(): PrismaClient {
  if (isPrismaPostgres) {
    // Use Prisma Postgres / Accelerate
    return new PrismaClient({
      accelerateUrl: databaseUrl,
    });
  } else {
    // Use standard PostgreSQL with pg adapter
    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
      adapter,
    });
  }
}

export const db: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
