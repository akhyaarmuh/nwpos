import express from "express";
import {
  getProductByBarcode,
  getAllProduct,
  createProduct,
  deleteProductById,
  updateProductById,
  // getProductByBarcodeBuy,
  // updateStockById,
} from "./controller.js";
const route = express.Router();

route.get("/:barcode", getProductByBarcode);
route.get("/", getAllProduct);
route.post("/", createProduct);
route.delete("/:id", deleteProductById);
route.patch("/:id", updateProductById);
// route.get("/buy/:barcode", getProductByBarcodeBuy);
// route.patch("/update-stock/:id", updateStockById);

export default route;
