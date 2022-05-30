import Buy from "./model.js";
import { updateStock } from "../sale/controller.js";

export const createBuy = async (req, res) => {
  const payload = req.body;

  try {
    const newBuy = new Buy(payload);
    await newBuy.save();
    res.sendStatus(201);

    updateStock(payload.cart, "add");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllBuy = async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 0;

  try {
    let allPage = await Buy.find();
    allPage = Math.ceil(allPage.length / limit) - 1;
    const buys = await Buy.find()
      .populate("supplier")
      .sort("-createdAt")
      .limit(limit)
      .skip(limit * page);

    const prev = page === 0 ? null : (page - 1).toString();
    const next = page + 1 > allPage ? null : (page + 1).toString();
    res.status(200).json({ data: buys, pages: { prev, next, page } });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getBuyById = async (req, res) => {
  try {
    const buy = await Buy.findById(req.params.id).populate("supplier");

    if (!buy) return res.sendStatus(404);

    res.status(200).json({ data: buy });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateBuyById = async (req, res) => {
  const payload = req.body;

  try {
    await Buy.findOneAndUpdate({ _id: req.params.id }, payload);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteBuyById = async (req, res) => {
  try {
    await Buy.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
