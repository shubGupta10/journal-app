// Assuming a Prisma client or similar ORM is used
import prisma from './prisma'; // Assuming prisma client is initialized here

export async function deleteEntriesByUserId(userId: string) {
    await prisma.entry.deleteMany({
        where: {
            userId: userId,
        },
    });
}