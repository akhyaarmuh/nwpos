import express from "express";
import {
  createSupplier,
  getAllSupplier,
  updateSupplierById,
  deleteSupplierById,
} from "./controller.js";
const route = express.Router();

route.post("/", createSupplier);
route.get("/", getAllSupplier);
route.patch("/:id", updateSupplierById);
route.delete("/:id", deleteSupplierById);

export default route;
