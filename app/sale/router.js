import express from "express";
import {
  createSale,
  getAllSale,
  getSaleById,
  updateSaleById,
  deleteSaleById,
  payCredit,
  getDashboard,
} from "./controller.js";

const route = express.Router();

route.post("/", createSale);
route.get("/", getAllSale);
route.get("/dashboard", getDashboard);
route.get("/:id", getSaleById);
route.patch("/pay/:id", payCredit);
route.patch("/:id", updateSaleById);
route.delete("/:id", deleteSaleById);

export default route;
