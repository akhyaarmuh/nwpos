import express from "express";
import {
  getProductByBarcode,
  createProduct,
  getAllProduct,
  deleteProductById,
  updateProductById,
} from "./controller.js";

const route = express.Router();

route.post("/", createProduct);
route.get("/:barcode", getProductByBarcode);
route.get("/", getAllProduct);
route.patch("/:id", updateProductById);
route.delete("/:id", deleteProductById);

export default route;
