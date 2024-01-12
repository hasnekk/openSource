import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const idBytesLength = 12;

// to fetch all data START
async function getDepartureCities() {
    let departureCities = await prisma.city.findMany();
    return departureCities;
}

async function getDestinations(departureCityId) {
    if (Buffer.from(departureCityId, 'hex').length != idBytesLength) {
        throw new Error("Id must be exactly 12 bytes long");
    }

    let destinations = await prisma.transitRoutes.findMany({
        where: {
            departureCityId: {
                id: departureCityId
            }
        }
    });

    if (destinations == null) {
        throw new Error("No destinations from this city");
    }

    return destinations;
}
// to fetch all data END

// for single departure city and its destinations START
async function getDepartureCity(id) {
    if (Buffer.from(id, 'hex').length != idBytesLength) {
        throw new Error("Id must be exactly 12 bytes long");
    }

    let departureCity = await prisma.city.findUnique({
        where: {
            id: id
        }
    });

    if (departureCity == null) {
        throw new Error("City not found");
    }

    return departureCity;
}

// for destination and its deparutes START
async function getDestinationCity(id) {
    if (Buffer.from(id, 'hex').length != idBytesLength) {
        throw new Error("Id must be exactly 12 bytes long");
    }

    let destinationCity = await prisma.transitRoutes.findUnique({
        where: {
            id: id
        }
    });

    if (destinationCity == null) {
        throw new Error("Route not found");
    }

    let departureCity = await allDepartureCitiesIdsForDesByName(destinationCity.destination);

    destinationCity.departureCity = departureCity;

    return destinationCity;
}

async function allDepartureCitiesIdsForDesByName(name) {
    let allDepartureCities = await prisma.transitRoutes.findMany({
        where: {
            destination: name
        }
    });

    let allDepartureCitiesIds = [];

    for (let city of allDepartureCities) {
        allDepartureCitiesIds.push(city.departureCity);
    }

    return allDepartureCitiesIds;
}

async function getDepartures(idsArr) {
    for (let id of idsArr) {
        if (Buffer.from(id, 'hex').length != idBytesLength) {
            throw new Error("Id must be exactly 12 bytes long");
        }
    }

    let departues = [];
    let departure;

    for (let id of idsArr) {
        departure = await prisma.city.findUnique({
            where: {
                id: id
            }
        });
        departues.push(departure);
    }

    return departues;
}
// for destination and its deparutes END

// filter by one property
async function fitlerBy(property, value) {
    let data;

    const parsedValue = parseInt(value, 10);

    if (!isNaN(parsedValue)) {
        // If parsing succeeds, filter by property greater than the parsed value
        data = await prisma.city.findMany({
            where: {
                [property]: {
                    gt: parsedValue,
                },
            },
        });
    } else {
        // If parsing fails, filter by property equal to the original value
        data = await prisma.city.findMany({
            where: {
                OR: [
                    {
                        [property]: {
                            contains: value, // Check if property contains the specified substring
                        },
                    },
                    {
                        [property]: value, // Check if property is equal to the specified value
                    },
                ],
            },
        });
    }

    return data;
}

// add city
async function addCity(city) {
    let newCity = await prisma.city.create({
        data: {
            name: city.name,
            country: city.country,
            region: city.region,
            population: city.population,
            language: city.language,
            currency: city.currency,
            timezone: city.timezone,
            area: city.area,
        },
    });

    return newCity;
}

// add transitRoute
async function addTransitRoute(transitRoute) {
    let newTransitRoute = await prisma.transitRoutes.create({
        data: transitRoute,
    });

    return newTransitRoute;
}

// update city
async function updateOneCity(id, data) {
    const updatedCity = await prisma.city.update({
        where: {
            id: id,
        },
        data: data,
    });

    return updatedCity;
}

// update transitRoute
async function updateTransitRoute(id, data) {
    const updatedRoute = await prisma.transitRoutes.update({
        where: {
            id: id,
        },
        data: data,
    });

    return updatedRoute;
}

// delete city
async function deleteCity(id) {
    let deletedCity = await prisma.city.delete({
        where: {
            id: id,
        },
    });

    return deletedCity;
}

// delete transitRoute
async function deleteTransitRoute(id) {
    let deletedTransitRoute = await prisma.transitRoutes.delete({
        where: {
            id: id,
        },
    });

    return deletedTransitRoute;
}


// delete all transitRoutes from this city
async function deleteAllTransitRoutesFrom(id) {
    let deletedTransitRoutes = await prisma.transitRoutes.deleteMany({
        where: {
            departureCity: id,
        },
    });

    return deletedTransitRoutes;
}

export { getDepartureCities, getDestinations, getDepartureCity, getDestinationCity, getDepartures, fitlerBy, addTransitRoute, addCity, updateOneCity, updateTransitRoute, deleteCity, deleteTransitRoute, deleteAllTransitRoutesFrom };
