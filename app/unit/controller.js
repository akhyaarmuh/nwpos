import Unit from "./model.js";
import Product from "../product/model.js";

export const getAllUnit = async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 0;

  try {
    let allPage = await Unit.find();
    allPage = Math.ceil(allPage.length / limit) - 1;
    const units = await Unit.find()
      .sort("-createdAt")
      .limit(limit)
      .skip(limit * page);

    const prev = page === 0 ? null : (page - 1).toString();
    const next = page + 1 > allPage ? null : (page + 1).toString();
    res.status(200).json({ data: units, pages: { prev, next } });
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
