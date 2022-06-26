import Unit from "./model.js";
import Product from "../product/model.js";

export const getAllUnit = async (req, res) => {
  try {
    const units = await Unit.find().sort("-createdAt");

    res.status(200).json({ data: units });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteUnitById = async (req, res) => {
  try {
    const using = await Product.findOne({ units: req.params.id });
    if (using)
      return res.status(405).json({ message: "Satuan sedang digunakan" });

    await Unit.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const createUnit = async (req, res) => {
  const name = req.body.name;
  try {
    const available = await Unit.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (available)
      return res.status(400).json({ message: `Satuan ${name} sudah ada` });

    const newUnit = new Unit({ name });
    await newUnit.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateUnitById = async (req, res) => {
  const name = req.body.name;
  const _id = req.params.id;
  try {
    const unit = await Unit.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (unit && unit._id.toString() !== _id)
      return res.status(400).json({ message: `Satuan ${name} sudah ada` });

    await Unit.findOneAndUpdate({ _id }, { name });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
