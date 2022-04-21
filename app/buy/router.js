import express from "express";
import {
  createBuy,
  getAllBuy,
  updateBuyById,
  deleteBuyById,
} from "./controller.js";

const route = express.Router();

route.post("/", createBuy);
route.get("/", getAllBuy);
route.patch("/:id", updateBuyById);
route.delete("/:id", deleteBuyById);

export default route;
