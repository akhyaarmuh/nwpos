import express from "express";
import {
  getAllSale,
  createSale,
  getSaleById,
  updateSaleById,
  deleteSaleById,
  // payCredit,
  // getDashboard,
} from "./controller.js";

const route = express.Router();

route.get("/", getAllSale);
route.post("/", createSale);
route.get("/:id", getSaleById);
route.patch("/:id", updateSaleById);
route.delete("/:id", deleteSaleById);
// route.get("/dashboard", getDashboard);
// route.patch("/pay/:id", payCredit);

export default route;
