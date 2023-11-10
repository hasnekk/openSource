import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getDepartureCities() {
    let departureCities = await prisma.city.findMany();
    return departureCities;
}

async function getDestinations(departureCityId) {
    let destinations = await prisma.transitRoutes.findMany({
        where: {
            departureCityId: {
                id: departureCityId
            }
        }
    });
    return destinations;
}


export { getDepartureCities, getDestinations };