import express from "express";
import {
  createBuy,
  getAllBuy,
  getBuyById,
  updateBuyById,
  deleteBuyById,
  // payCredit,
  // getDashboard,
} from "./controller.js";

const route = express.Router();

route.post("/", createBuy);
route.get("/", getAllBuy);
route.get("/:id", getBuyById);
route.patch("/:id", updateBuyById);
route.delete("/:id", deleteBuyById);
// route.get("/dashboard", getDashboard);
// route.patch("/pay/:id", payCredit);

export default route;
