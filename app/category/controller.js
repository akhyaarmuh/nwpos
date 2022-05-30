import Category from "./model.js";
import Product from "../product/model.js";

export const getAllCategory = async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 0;

  try {
    let allPage = await Category.find();
    allPage = Math.ceil(allPage.length / limit) - 1;
    const categories = await Category.find()
      .sort("-createdAt")
      .limit(limit)
      .skip(limit * page);

    const prev = page === 0 ? null : (page - 1).toString();
    const next = page + 1 > allPage ? null : (page + 1).toString();
    res.status(200).json({ data: categories, pages: { prev, next } });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteCategoryById = async (req, res) => {
  try {
    const using = await Product.findOne({ category: req.params.id });
    if (using)
      return res.status(405).json({ message: "Kategori sedang digunakan" });

    await Category.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const createCategory = async (req, res) => {
  const name = req.body.name;
  try {
    const available = await Category.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (available)
      return res.status(400).json({ message: `Kategori ${name} sudah ada` });

    const newCategory = new Category({ name });
    await newCategory.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateCategoryById = async (req, res) => {
  const name = req.body.name;
  const _id = req.params.id;
  try {
    const category = await Category.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (category && category._id.toString() !== _id)
      return res.status(400).json({ message: `Kategori ${name} sudah ada` });

    await Category.findOneAndUpdate({ _id }, { name });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
