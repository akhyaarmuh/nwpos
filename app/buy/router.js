import express from "express";
import {
  createBuy,
  getAllBuy,
  getBuyById,
  deleteBuyById,
  payCreditBuyById,
  // updateBuyById,
  // payCredit,
  // getDashboard,
} from "./controller.js";

const route = express.Router();

route.post("/", createBuy);
route.get("/", getAllBuy);
route.get("/:id", getBuyById);
route.patch("/pay-credit/:id", payCreditBuyById);
route.delete("/:id", deleteBuyById);
// route.patch("/:id", updateBuyById);
// route.get("/dashboard", getDashboard);
// route.patch("/pay/:id", payCredit);

export default route;
