import express from "express";
import { getStore, updateStore } from "./controller.js";

const route = express.Router();

route.get("/", getStore);
route.patch("/", updateStore);

export default route;
