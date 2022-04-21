import express from "express";
// import { verifyToken } from "../middleware/verifyToken.js";
import {
  createUnit,
  getAllUnit,
  updateUnitById,
  deleteUnitById,
} from "./controller.js";
const route = express.Router();

route.post("/", createUnit);
route.get("/", getAllUnit);
route.patch("/:id", updateUnitById);
route.delete("/:id", deleteUnitById);

export default route;
