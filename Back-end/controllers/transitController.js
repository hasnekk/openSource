import express from "express";
import fs from "fs";

import { getDepartureCities, getDestinations, getDepartureCity, getDestinationCity, getDepartures, fitlerBy, addTransitRoute, addCity, updateOneCity, updateTransitRoute, deleteCity, deleteTransitRoute, deleteAllTransitRoutesFrom } from "../prisma/dataBaseOperations.js";

import { checkIfCity, checkIfTransitRoute } from "../utils/requieredProperties.js";

const router = express.Router();

const contextInfoCity = {
    "@vocab": "http://schema.org/",
    "@type": "City",
    "name": "name",
    "country": {
        "@type": "Country",
        "@id": "addressCountry",
    },
    "region": "containedInPlace",
    "population": {
        "@type": "PropertyValue",
        "name": "population",
    },
    "language": {
        "@type": "Language",
        "@id": "name"
    },
    "currency": "currency",
    "timezone": {
        "@type": "Schedule",
        "@id": "scheduleTimezone"
    },
    "area": {
        "@type": "Place",
        "@id": "area"
    },
    "destinations": {
        "@type": "Trip",
        "@id": "itinerary",
    },
};

const contextInfoRoute = {
    "@vocab": "http://schema.org/",
    "@type": "Trip",
    "departureCity": {
        "@type": "Trip",
        "@id": "tripOrigin",
    },
    "destination": {
        "@type": "Trip",
        "@id": "itinerary",
    },
    "distance": {
        "@type": "Distance",
        "@id": "distance"
    },
    "duration": {
        "@type": "Schedule",
        "@id": "duration"
    },
    "price": {
        "@type": "PriceSpecification",
        "@id": "price"
    }
}

// This API end point will fetch all data  
router.get("/", async (req, res) => {
    let allDepartureCities = await getDepartureCities();

    for (let city of allDepartureCities) {
        city["@context"] = contextInfoCity;

        let destinations = await getDestinations(city.id);
        destinations = destinations.map(destination => {
            return { ...destination, "@context": contextInfoRoute }
        });
        city.destinations = destinations;
    }

    res.status(200).json(allDepartureCities);
});

// This API end point will fetch a single city and where you can go to from that city
router.get("/departure/:id", async (req, res) => {
    let departureCityId = req.params.id;

    try {
        let departureCity = await getDepartureCity(departureCityId);
        departureCity["@context"] = contextInfoCity;
        let destinations = await getDestinations(departureCityId);
        destinations = destinations.map(destination => {
            return { ...destination, "@context": contextInfoRoute }
        });
        departureCity.destinations = destinations;
        res.status(200).json(departureCity);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// This API end point will fetch a destination city and from wich cities you can go to that city
router.get("/destination/:id", async (req, res) => {
    let destinationCityId = req.params.id;

    try {
        let destinationCity = await getDestinationCity(destinationCityId);
        destinationCity["@context"] = contextInfoCity;
        let departures = await getDepartures(destinationCity.departureCity);
        departures = departures.map(departures => {
            return { ...departures, "@context": contextInfoRoute }
        });
        destinationCity.departures = departures;
        res.json(destinationCity);
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
});

// This API end point will fetch cities with population over x
router.get("/population/:population", async (req, res) => {
    let population = req.params.population;

    try {
        let cities = await fitlerBy("population", population);
        cities = cities.map(city => {
            return { ...city, "@context": contextInfoCity }
        });
        res.status(200).json(cities);
    } catch (e) {
        res.status(404).json({ error: e.message });
    }

});

// This API end point will fetch cities that have the language = language
router.get("/language/:language", async (req, res) => {
    let language = req.params.language;

    try {
        let cities = await fitlerBy("language", language);
        cities = cities.map(city => {
            return { ...city, "@context": contextInfoCity }
        });
        res.status(200).json(cities);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



// This API end point will add a new city 
router.post("/addCity", async (req, res) => {
    let city = req.body;

    if (!checkIfCity(city)) {
        return res.status(400).json({ error: "Wrong properties for city" });
    }

    try {
        city = await addCity(city);
        city = { ...city, "@context": contextInfoCity }
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }

    // OVO U OPEN API
    return res.status(200).json({ city: city, deleteCity: `http://localhost:3000/transit/deleteCity/${city.id}`, updateCity: `http://localhost:3000/transit/updateCity/${city.id}` });
});

// This API end point will add a new route
router.post("/addRoute", async (req, res) => {
    let route = req.body;

    if (!checkIfTransitRoute(route)) {
        return res.status(400).json({ error: "Wrong properties for transit route" });
    }

    let addedRoute;

    try {
        await getDepartureCity(route.departureCity); // baca error ako ne postoji
        addedRoute = await addTransitRoute(route);
        addedRoute = { ...addedRoute, "@context": contextInfoRoute }
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }

    // OVO DODATI U OPEN API
    return res.status(200).json({ route: addedRoute, deletedRoute: `http://localhost:3000/transit/deleteRoute/${addedRoute.id}`, updateRoute: `http://localhost:3000/transit/updateRoute/${addedRoute.id}` });

});

// This API end point will modify one city or destination
router.put("/updateCity/:id", async (req, res) => {
    let id = req.params.id;
    let data = req.body;

    let updatedCity;

    try {
        await getDepartureCity(id); // check if exists
        updatedCity = await updateOneCity(id, data);
        updatedCity = { ...updatedCity, "@context": contextInfoCity }
    } catch (e) {
        return res.status(404).json({ error: e.message });
    }

    return res.status(200).json({ updatedCity: updatedCity, deleteCity: `http://localhost:3000/transit/deleteCity/${updatedCity.id}`, updateCity: `http://localhost:3000/transit/updateCity/${updatedCity.id}` });
});

router.put("/updateRoute/:id", async (req, res) => {
    let id = req.params.id;
    let data = req.body;

    let updatedRoute;

    try {

        if ("departureCity" in data) {
            await getDepartureCity(data.departureCity);
        }

        await getDestinationCity(id); // check if exists
        updatedRoute = await updateTransitRoute(id, data);
        updatedRoute = { ...updatedRoute, "@context": contextInfoRoute }
    } catch (e) {
        return res.status(404).json({ error: e.message });
    }

    return res.status(200).json({ updatedRoute: updatedRoute, deletedRoute: `http://localhost:3000/transit/deleteRoute/${updatedRoute.id}`, updateRoute: `http://localhost:3000/transit/updateRoute/${updatedRoute.id}` });

});

// This API end point will delete one city and its destinations
router.delete("/deleteCity/:id", async (req, res) => {
    let id = req.params.id;

    try {
        await getDepartureCity(id); // check if exists
        await deleteAllTransitRoutesFrom(id);
        let deletedCity = await deleteCity(id);
        deletedCity = { ...deletedCity, "@context": contextInfoCity }
        return res.status(200).json(deletedCity);
    } catch (e) {
        return res.status(404).json({ error: e.message });
    }
});

// This API end point will delete one destination
router.delete("/deleteRoute/:id", async (req, res) => {
    let id = req.params.id;

    try {
        await getDestinationCity(id); // check if exists    
        let deletedRoute = await deleteTransitRoute(id);
        deletedRoute = { ...deletedRoute, "@context": contextInfoRoute }
        return res.status(200).json(deletedRoute);
    } catch (e) {
        return res.status(404).json({ error: e.message });
    }
});



router.get("/openApi", (req, res) => {
    const filePath = "../openapi.json";

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist, return 404 Not Found
            return res.status(404).json({ error: "Not Found" });
        }

        // File exists, send it
        res.sendFile("openapi.json", { root: "./" });
    });
});



export default router;