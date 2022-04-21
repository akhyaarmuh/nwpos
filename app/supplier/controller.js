import Supplier from "./model.js";
import { checkIsUsed } from "../../utilities/index.js";

export const createSupplier = async (req, res) => {
  const used = await checkIsUsed(Supplier, "noHp", req.body.noHp);
  if (used)
    return res.status(400).json({ message: "Nomor hp sudah digunakan" });

  const newSupplier = new Supplier(req.body);
  try {
    await newSupplier.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllSupplier = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .sort("-createdAt")
      .select("name noHp address bank");
    res.status(200).json({ data: suppliers });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateSupplierById = async (req, res) => {
  try {
    await Supplier.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteSupplierById = async (req, res) => {
  try {
    await Supplier.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
