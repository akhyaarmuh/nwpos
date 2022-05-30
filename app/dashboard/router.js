import express from "express";

import { getAll } from "./controller.js";
const route = express.Router();

route.get("/", getAll);

export default route;
