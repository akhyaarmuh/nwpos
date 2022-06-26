import Buy from "./model.js";
import Product from "../product/model.js";
import { getDate } from "../../utilities/index.js";

const inputStock = (cart) => {
  cart.forEach(async (pro) => {
    const product = await Product.findById(pro._id);
    const allStock = product.stock + pro.qty * product.unit[pro.unit];
    const allPrice = product.stock * product.modal + pro.total;
    await Product.findByIdAndUpdate(pro._id, {
      stock: allStock,
      modal: Math.ceil(allPrice / allStock),
    });
  });
};

export const createBuy = async (req, res) => {
  const payload = req.body;

  try {
    const newBuy = new Buy(payload);
    await newBuy.save();
    res.sendStatus(201);

    inputStock(payload.cart);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllBuy = async (req, res) => {
  // const limit = Number(req.query.limit) || 20;
  // const page = Number(req.query.page) || 0;

  try {
    // let allPage = await Buy.find();
    // allPage = Math.ceil(allPage.length / limit) - 1;
    const buys = await Buy.find()
      .populate("supplier")
      .sort("-createdAt")
      .select("supplier cart date time total debt payHistory");
    // .limit(limit)
    // .skip(limit * page)
    res.status(200).json({ data: buys });
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

export const deleteBuyById = async (req, res) => {
  try {
    await Buy.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const payCreditBuyById = async (req, res) => {
  const value = req.body.pay;
  const date = getDate();
  try {
    const buy = await Buy.findById(req.params.id);
    const debt = buy.debt - value;
    const payHistory = buy.payHistory;
    payHistory.push({ date, value });

    await Buy.findByIdAndUpdate(req.params.id, { debt, payHistory });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// export const updateBuyById = async (req, res) => {
//   const payload = req.body;

//   try {
//     await Buy.findOneAndUpdate({ _id: req.params.id }, payload);
//     res.sendStatus(200);
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Internal server error" });
//   }
// };
