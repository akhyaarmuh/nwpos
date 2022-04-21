import express from "express";
import { getAllReport, deleteReportById } from "./controller.js";

const route = express.Router();

route.get("/", getAllReport);
route.delete("/:id", deleteReportById);

export default route;
