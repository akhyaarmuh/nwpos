import express from "express";
import {
  createProduct,
  getAllProduct,
  getProductByBarcode,
  getProductByBarcodeBuy,
  updateProductById,
  deleteProductById,
  updateStockById,
} from "./controller.js";
const route = express.Router();

route.post("/", createProduct);
route.get("/", getAllProduct);
route.get("/buy/:barcode", getProductByBarcodeBuy);
route.get("/:barcode", getProductByBarcode);
route.patch("/update-stock/:id", updateStockById);
route.patch("/:id", updateProductById);
route.delete("/:id", deleteProductById);

export default route;
