import "dotenv/config"; 

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg; 

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,      
}); 

const adapter = new PrismaPg(pool); 

const prisma = new PrismaClient({
  adapter, 
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();

    const dbCheck = await prisma.$queryRaw`
      SELECT current_database() as database, current_schema() as schema,     inet_server_addr() as server_ip
    `;

    console.log("DB Connected via Prisma");
    console.log("Connected to:", dbCheck);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };