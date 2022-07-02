import Sale from "./model.js";

import Product from "../product/model.js";
import Customer from "../customer/model.js";
import { getDate } from "../../utilities/index.js";

const kurangiStok = (cart) => {
  cart.forEach(async (product) => {
    const pro = await Product.findById(product._id);
    if (!pro) return;
    await Product.findByIdAndUpdate(product._id, {
      stock: pro.stock - product.qty * product.unitQty,
    });
  });
};

const tambahStok = async (id, qty, price) => {
  const pro = await Product.findById(id);
  if (!pro) return;

  const stock = pro.stock + qty;
  const allPrice = pro.stock * pro.modal + price;
  const modal = Math.ceil(allPrice / stock);

  await Product.findByIdAndUpdate(id, {
    stock,
    modal,
  });
};

const getNewCart = (productReturn, oldCart) => {
  if (productReturn.qtyInput === 0) {
    return oldCart.filter((pro) => pro._id !== productReturn._id);
  } else {
    return oldCart.map((pro) => {
      if (pro._id === productReturn._id) {
        return {
          ...pro,
          qty: productReturn.qtyInput,
          qtyInput: productReturn.qtyInput,
          total: productReturn.qtyInput * productReturn.price,
        };
      }
      return pro;
    });
  }
};

export const getAllSale = async (req, res) => {
  const status = req.query.status;
  const name = req.query.name;
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 0;
  const offset = limit * page;
  const sort = req.query.sort || "-createdAt";

  const query = {};
  const and = [];

  if (status === "debt") and.push({ debt: { $gt: 0 } });
  if (name) {
    const customers = await Customer.find({ name: new RegExp(name, "i") });
    const or = [];
    if (customers.length > 0) {
      customers.forEach((customer) => or.push({ customer: customer._id }));
    } else {
      or.push({ customer: "1234567a891b0c111d21e3f1" });
    }
    and.push({ $or: or });
  }

  if (and.length > 0) query.$and = and;

  try {
    const sales = await Sale.find(query);
    const rows = sales.length;
    const allPage = Math.ceil(rows / limit);
    const data = await Sale.find(query)
      .populate("customer")
      .sort(sort)
      .limit(limit)
      .skip(offset)
      .select("date time customer debt total");

    res.status(200).json({ data, page, limit, rows, allPage });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const createSale = async (req, res) => {
  const { cashback, ...sale } = req.body;

  try {
    const newSale = new Sale(sale);
    await newSale.save();
    res.sendStatus(201);

    kurangiStok(sale.cart);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("customer")
      .select("invoice cart date time total debt customer payHistory");

    if (!sale) return res.sendStatus(404);

    res.status(200).json({ data: sale });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const payCreditSaleById = async (req, res) => {
  const value = req.body.pay;
  const date = getDate();
  try {
    const sale = await Sale.findById(req.params.id);
    const debt = sale.debt - value;
    const payHistory = sale.payHistory;
    payHistory.push({ date, value });

    await Sale.findByIdAndUpdate(req.params.id, { debt, payHistory });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const returnProductSaleById = async (req, res) => {
  const product = req.body;
  const qtyReturn = (product.qty - product.qtyInput) * product.unitQty;
  const allPriceReturn = product.modal * qtyReturn;

  try {
    const sale = await Sale.findById(req.params.id);

    const newCart = getNewCart(product, sale.cart);

    if (newCart.length === 0) {
      await Sale.findByIdAndDelete(req.params.id);
      res.sendStatus(200);
      // tambah stok produk
      await tambahStok(product._id, qtyReturn, allPriceReturn);
      return;
    }

    const total = newCart.reduce((tot, num) => tot + num.price * num.qty, 0);
    const profit = newCart.reduce((tot, num) => tot + num.profit * num.qty, 0);

    if (sale.debt > 0) {
      const allPay = sale.payHistory.reduce((tot, num) => tot + num.value, 0);
      const debt = total - allPay < 0 ? 0 : total - allPay;
      await Sale.findByIdAndUpdate(req.params.id, {
        cart: newCart,
        total,
        profit,
        debt,
      });
    } else {
      await Sale.findByIdAndUpdate(req.params.id, {
        cart: newCart,
        total,
        profit,
      });
    }

    res.sendStatus(200);
    await tambahStok(product._id, qtyReturn, allPriceReturn);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteSaleById = async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
