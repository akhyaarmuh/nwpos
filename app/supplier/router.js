import express from "express";
import {
  getAllSupplier,
  createSupplier,
  updateSupplierById,
  deleteSupplierById,
} from "./controller.js";
const route = express.Router();

route.get("/", getAllSupplier);
route.post("/", createSupplier);
route.patch("/:id", updateSupplierById);
route.delete("/:id", deleteSupplierById);

export default route;
