import express from "express";
import fs from "fs";

import { getDepartureCities, getDestinations, getDepartureCity, getDestinationCity, getDepartures, fitlerBy, addTransitRoute, addCity, updateOneCity, updateTransitRoute, deleteCity, deleteTransitRoute, deleteAllTransitRoutesFrom } from "../prisma/dataBaseOperations.js";

import { checkIfCity, checkIfTransitRoute } from "../utils/requieredProperties.js";


const router = express.Router();

// This API end point will fetch all data  
router.get("/", async (req, res) => {
    let allDepartureCities = await getDepartureCities();

    for (let city of allDepartureCities) {
        let destinations = await getDestinations(city.id);
        city.destinations = destinations;
    }

    res.status(200).json(allDepartureCities);
});

// This API end point will fetch a single city and where you can go to from that city
router.get("/departure/:id", async (req, res) => {
    let departureCityId = req.params.id;

    try {
        let departureCity = await getDepartureCity(departureCityId);
        let destinations = await getDestinations(departureCityId);
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
        let departures = await getDepartures(destinationCity.departureCity);
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
        res.status(200).json(cities);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// This API end point will add a new city and its destinations
router.post("/add/:isTransitRoute", async (req, res) => {
    let isTransitRoute = req.params.isTransitRoute;

    isTransitRoute = JSON.parse(isTransitRoute.toLowerCase())

    if (typeof isTransitRoute !== "boolean") {
        return res.json({ error: "isTransitRoute must be boolean" });
    }

    let city = req.body;

    if (isTransitRoute) {
        if (!checkIfTransitRoute(city)) {
            return res.status(400).json({ error: "Wrong properties for transit route" });
        }

        try {
            await getDepartureCity(city.departureCity); // baca error ako ne postoji
            city = await addTransitRoute(city);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }

    } else {

        if (!checkIfCity(city)) {
            return res.status(400).json({ error: "Wrong properties for city" });
        }


        try {
            city = await addCity(city);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }

    }

    return res.status(200).json(city);
});

// This API end point will modify one city or destination
router.put("/updateCity/:id", async (req, res) => {
    let id = req.params.id;
    let data = req.body;

    try {
        await getDepartureCity(id); // check if exists
        let updatedCity = await updateOneCity(id, data);
        return res.status(200).json(updatedCity);
    } catch (e) {
        return res.status(404).json({ error: e.message });
    }
});

router.put("/updateRoute/:id", async (req, res) => {
    let id = req.params.id;
    let data = req.body;

    try {

        if ("departureCity" in data) {
            await getDepartureCity(data.departureCity);
        }

        await getDestinationCity(id); // check if exists
        let updatedRoute = await updateTransitRoute(id, data);
        return res.status(200).json(updatedRoute);
    } catch (e) {
        return res.status(404).json({ error: e.message });
    }

});

// This API end point will delete one city and its destinations
router.delete("/deleteCity/:id", async (req, res) => {
    let id = req.params.id;

    try {
        await getDepartureCity(id); // check if exists
        await deleteAllTransitRoutesFrom(id);
        let deletedCity = await deleteCity(id);
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