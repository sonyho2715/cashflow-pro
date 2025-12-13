import { PrismaClient } from '@/app/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Support both Prisma Postgres (accelerateUrl) and standard PostgreSQL
const databaseUrl = process.env.DATABASE_URL!;
const isPrismaPostgres = databaseUrl?.startsWith('prisma+postgres://');

export const db = globalForPrisma.prisma ?? new PrismaClient(
  isPrismaPostgres
    ? { accelerateUrl: databaseUrl, log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'] }
    : { log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'] } as Parameters<typeof PrismaClient>[0]
);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
