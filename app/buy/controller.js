import Buy from "./model.js";
import Product from "../product/model.js";
import { findValueInObject, getDate, getTime } from "../../utilities/index.js";

const addStock = (cart) => {
  cart.forEach(async (product) => {
    const pro = await Product.findById(product._id);
    if (!pro) return;

    const stock = pro.stock + product.qty * findValueInObject(pro.unit, "max");
    const allPrice = pro.modal * pro.stock + product.total;
    const modal = Math.ceil(allPrice / stock);

    await Product.findByIdAndUpdate(product._id, { stock, modal });
  });
};

export const createBuy = async (req, res) => {
  const payload = req.body;
  payload.time = getTime();
  payload.date = getDate();

  const newBuy = new Buy(req.body);
  try {
    await newBuy.save();
    res.sendStatus(201);
    addStock(req.body.cart);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllBuy = async (req, res) => {
  try {
    const buys = await Buy.find()
      .populate("supplier")
      .sort("-createdAt")
      .select("date time supplier debt  total");
    res.status(200).json({ data: buys });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateBuyById = async (req, res) => {
  try {
    const buy = await Buy.findOne({ _id: req.params.id });
    const debt = req.body.pay >= buy.debt ? 0 : buy.debt - req.body.pay;

    await Buy.findByIdAndUpdate(req.params.id, { debt });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteBuyById = async (req, res) => {
  try {
    await Buy.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
