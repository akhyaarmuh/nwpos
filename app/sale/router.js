import express from "express";
import {
  getAllSale,
  createSale,
  getSaleById,
  payCreditSaleById,
  returnProductSaleById,
  deleteSaleById,
} from "./controller.js";

const route = express.Router();

route.post("/", createSale);
route.get("/", getAllSale);
route.get("/:id", getSaleById);
route.patch("/pay-credit/:id", payCreditSaleById);
route.patch("/return-product/:id", returnProductSaleById);
route.delete("/:id", deleteSaleById);

export default route;
