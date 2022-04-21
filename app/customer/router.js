import express from "express";
import {
  createCustomer,
  getAllCustomer,
  updateCustomerById,
  deleteCustomerById,
} from "./controller.js";
const route = express.Router();

route.post("/", createCustomer);
route.get("/", getAllCustomer);
route.patch("/:id", updateCustomerById);
route.delete("/:id", deleteCustomerById);

export default route;
