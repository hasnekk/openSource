import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import 'dotenv/config';

// controlers
import { default as transitRouter } from "./controllers/transitController.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/transits', transitRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
