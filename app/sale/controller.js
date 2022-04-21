import Sale from "./model.js";
import Product from "../product/model.js";
import { getTime, getDate, getDateYesterday } from "../../utilities/index.js";
import { printStruk } from "../../utilities/print.js";

const updateStock = (cart, action) => {
  if (action === "min") {
    cart.forEach(async (product) => {
      const pro = await Product.findById(product._id);
      if (!pro) return;
      await Product.findByIdAndUpdate(product._id, {
        stock: pro.stock - product.qty * product.unitQty,
      });
    });
  } else {
    cart.forEach(async (product) => {
      const pro = await Product.findById(product._id);
      if (!pro) return;

      const stock = pro.stock + product.qty * product.unitQty;
      const allPrice =
        pro.stock * pro.modal + product.qty * product.unitQty * product.modal;
      const modal = Math.ceil(allPrice / stock);

      await Product.findByIdAndUpdate(product._id, {
        stock,
        modal,
      });
    });
  }
};

export const createSale = async (req, res) => {
  const { print, ...payload } = req.body;
  payload.date = getDate();
  payload.time = getTime();

  try {
    if (print) {
      await printStruk(payload);
    }

    delete payload.pay;
    delete payload.cashback;

    const newSale = new Sale(payload);
    await newSale.save();
    res.sendStatus(201);

    updateStock(req.body.cart, "min");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllSale = async (req, res) => {
  const perPage = 20;
  const name = req.query.keyword || "";
  const page = Number(req.query.page) < 0 ? 0 : Number(req.query.page) || 0;

  try {
    if (name) {
      const sales = await Sale.find({
        invoice: name,
      })
        .populate("customer")
        .select("date time customer debt total");

      res.status(200).json({ data: sales, page });
      return;
    }

    const sales = await Sale.find()
      .populate("customer")
      .select("date time customer debt total invoice")
      .sort("-createdAt")
      .limit(perPage)
      .skip(perPage * page);

    res.status(200).json({ data: sales, page });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("customer")
      .select("cart total debt profit payHistory invoice date time");

    if (!sale) return res.sendStatus(404);

    res.status(200).json({ data: sale });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateSaleById = async (req, res) => {
  const { returnProduct, cart, ...payload } = req.body;
  const newCart = cart.filter((pro) => pro.qty !== 0);

  if (newCart.length === 0) {
    await Sale.findByIdAndDelete(req.params.id);
    res.sendStatus(301);
    updateStock(returnProduct, "plus");
    return;
  }

  payload.cart = newCart;

  try {
    await Sale.findOneAndUpdate({ _id: req.params.id }, payload);
    res.sendStatus(200);
    updateStock(returnProduct, "plus");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteSaleById = async (req, res) => {
  try {
    const saleDeleted = await Sale.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(200);

    saleDeleted.cart.forEach(async (product) => {
      const pro = await Product.findById(product._id);
      if (!pro) return;

      const stock = pro.stock + product.qty * product.unitQty;
      const allPrice =
        pro.stock * pro.modal + product.qty * product.unitQty * product.modal;
      const modal = Math.ceil(allPrice / stock);
      await Product.findByIdAndUpdate(pro._id, { stock, modal });
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const payCredit = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    const debt = req.body.value >= sale.debt ? 0 : sale.debt - req.body.value;
    const payHistory = [
      ...sale.payHistory,
      { date: req.body.date, value: req.body.value },
    ];
    await Sale.findByIdAndUpdate(req.params.id, { debt, payHistory });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getDashboard = async (req, res) => {
  const date = getDate().split(" ");
  let salesToday = await Sale.find({ date: getDate() });
  let salesYesterday = await Sale.find({ date: getDateYesterday() });
  let salesMonth = await Sale.find({
    date: new RegExp(`${date[1]} ${date[2]}`),
  });
  let allProduct = await Product.find();

  const transaction = salesToday.length;
  salesToday = salesToday.reduce((tot, num) => tot + num.total, 0);
  salesYesterday = salesYesterday.reduce((tot, num) => tot + num.total, 0);
  const profitMonth = salesMonth.reduce((tot, num) => tot + num.profit, 0);
  salesMonth = salesMonth.reduce((tot, num) => tot + num.total, 0);
  allProduct = allProduct.reduce((tot, num) => tot + num.stock * num.modal, 0);
  res.status(200).json({
    data: {
      transaction,
      salesToday,
      salesYesterday,
      profitMonth,
      salesMonth,
      allProduct,
    },
  });
};
