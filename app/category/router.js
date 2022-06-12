import express from "express";
import {
  getAllCategory,
  deleteCategoryById,
  createCategory,
  updateCategoryById,
} from "./controller.js";

const route = express.Router();

route.post("/", createCategory);
route.get("/", getAllCategory);
route.patch("/:id", updateCategoryById);
route.delete("/:id", deleteCategoryById);

export default route;
