const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const connectDB = async () => {
    await prisma.$connect(); // Check the connection
};

module.exports = { connectDB, prisma };
