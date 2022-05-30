import express from "express";
import {
  getAllUnit,
  createUnit,
  updateUnitById,
  deleteUnitById,
} from "./controller.js";

const route = express.Router();

route.get("/", getAllUnit);
route.post("/", createUnit);
route.patch("/:id", updateUnitById);
route.delete("/:id", deleteUnitById);

export default route;
