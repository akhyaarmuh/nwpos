import express from "express";
// import { verifyToken } from "../middleware/verifyToken.js";
import {
  createCategory,
  getAllCategory,
  updateCategoryById,
  deleteCategoryById,
} from "./controller.js";
const route = express.Router();

route.post("/", createCategory);
route.get("/", getAllCategory);
route.patch("/:id", updateCategoryById);
route.delete("/:id", deleteCategoryById);

export default route;
