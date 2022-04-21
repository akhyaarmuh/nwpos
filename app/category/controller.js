import Category from "./model.js";
import Product from "../product/model.js";
import { checkIsUsed } from "../../utilities/index.js";

export const createCategory = async (req, res) => {
  const name = req.body.name;
  const category = await Category.findOne({
    name: new RegExp(`^${name}$`, "i"),
  });
  if (category)
    return res.status(400).json({ message: `Kategori ${name} sudah ada` });
  const newCategory = new Category(req.body);
  try {
    await newCategory.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find().select("name").sort("-createdAt");
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateCategoryById = async (req, res) => {
  const isUsed = await checkIsUsed(Product, "category", req.params.id);
  if (isUsed)
    return res.status(400).json({ message: "Kategori sedang digunakan" });

  const name = req.body.name;
  const _id = req.params.id;
  const category = await Category.findOne({
    name: new RegExp(`^${name}$`, "i"),
  });
  if (category && category._id.toString() !== _id)
    return res.status(400).json({ message: `Kategori ${name} sudah ada` });
  try {
    await Category.findOneAndUpdate({ _id }, { name });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteCategoryById = async (req, res) => {
  const isUsed = await checkIsUsed(Product, "category", req.params.id);
  if (isUsed)
    return res.status(400).json({ message: "Kategori sedang digunakan" });

  try {
    await Category.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
