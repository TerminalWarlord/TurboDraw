import { PrismaClient } from "@prisma/client";


const globalPrisma = global as unknown as { prisma: PrismaClient };


export const prismaClient = globalPrisma.prisma || new PrismaClient();



if(process.env.NODE_ENV!=='production'){
    globalPrisma.prisma = prismaClient;
}
