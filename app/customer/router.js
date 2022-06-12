import express from "express";
import {
  getAllCustomer,
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
} from "./controller.js";

const route = express.Router();

route.get("/", getAllCustomer);
route.post("/", createCustomer);
route.patch("/:id", updateCustomerById);
route.delete("/:id", deleteCustomerById);

export default route;
