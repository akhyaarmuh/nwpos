import Customer from "./model.js";
import { checkIsUsed } from "../../utilities/index.js";

export const createCustomer = async (req, res) => {
  const used = await checkIsUsed(Customer, "noHp", req.body.noHp);
  if (used)
    return res.status(400).json({ message: "Nomor hp sudah digunakan" });

  const newCustomer = new Customer(req.body);
  try {
    await newCustomer.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllCustomer = async (req, res) => {
  try {
    const customers = await Customer.find()
      .sort("-createdAt")
      .select("name noHp address");
    res.status(200).json({ data: customers });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateCustomerById = async (req, res) => {
  try {
    await Customer.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteCustomerById = async (req, res) => {
  try {
    await Customer.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
