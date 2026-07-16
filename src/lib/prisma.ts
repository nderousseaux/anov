import { PrismaClient } from "../generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function expandEnv(value: string): string {
  return value.replace(/\$\{([^}]+)\}/g, (_, name) => process.env[name] ?? "");
}

function createPrismaClient() {
  const connectionString = expandEnv(process.env.DATABASE_URL!);
  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");
  const adapter = isLocal
    ? new PrismaPg({ connectionString })
    : new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter } as ConstructorParameters<
    typeof PrismaClient
  >[0]);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
