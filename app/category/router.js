import express from "express";
import {
  getAllCategory,
  deleteCategoryById,
  createCategory,
  updateCategoryById,
} from "./controller.js";

const route = express.Router();

route.get("/", getAllCategory);
route.delete("/:id", deleteCategoryById);
route.post("/", createCategory);
route.patch("/:id", updateCategoryById);

export default route;
