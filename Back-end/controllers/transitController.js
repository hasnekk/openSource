import express from "express";

import { getDepartureCities, getDestinations } from "../prisma/dataBaseOperations.js";

const router = express.Router();

router.get("/", async (req, res) => {
    let allDepartureCities = await getDepartureCities();

    for (let city of allDepartureCities) {
        let destinations = await getDestinations(city.id);
        city.destinations = destinations;
    }

    res.json(allDepartureCities);
});




export default router;