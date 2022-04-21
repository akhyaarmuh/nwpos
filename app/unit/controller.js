import Unit from "./model.js";
import Product from "../product/model.js";
import { checkIsUsed } from "../../utilities/index.js";

export const createUnit = async (req, res) => {
  const name = req.body.name;
  const unit = await Unit.findOne({
    name: new RegExp(`^${name}$`, "i"),
  });
  if (unit)
    return res.status(400).json({ message: `Satuan ${name} sudah ada` });
  const newUnit = new Unit(req.body);
  try {
    await newUnit.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllUnit = async (req, res) => {
  try {
    const units = await Unit.find().select("name").sort("-createdAt");
    res.status(200).json({ data: units });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateUnitById = async (req, res) => {
  const isUsed = await checkIsUsed(Product, "units", req.params.id);
  if (isUsed)
    return res.status(400).json({ message: "Satuan sedang digunakan" });

  const name = req.body.name;
  const _id = req.params.id;
  const unit = await Unit.findOne({
    name: new RegExp(`^${name}$`, "i"),
  });
  if (unit && unit._id.toString() !== _id)
    return res.status(400).json({ message: `Satuan ${name} sudah ada` });
  try {
    await Unit.findOneAndUpdate({ _id }, { name });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteUnitById = async (req, res) => {
  const isUsed = await checkIsUsed(Product, "units", req.params.id);
  if (isUsed)
    return res.status(400).json({ message: "Satuan sedang digunakan" });

  try {
    await Unit.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
