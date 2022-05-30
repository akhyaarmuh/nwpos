import Sale from "./model.js";
import Product from "../product/model.js";
import Customer from "../customer/model.js";
// import { getTime, getDate, getDateYesterday } from "../../utilities/index.js";
// import { printStruk } from "../../utilities/print.js";

export const updateStock = (cart, action) => {
  if (action === "cut") {
    cart.forEach(async (product) => {
      const pro = await Product.findById(product._id);
      if (!pro) return;
      await Product.findByIdAndUpdate(product._id, {
        stock: pro.stock - product.qty * product.unitQty,
      });
    });
  } else if (action === "add") {
    cart.forEach(async (product) => {
      const pro = await Product.findById(product._id).populate("units");
      if (!pro) return;

      const unitBuy = pro.unit[pro.units[pro.units.length - 1].name];

      const stock = pro.stock + product.qty * unitBuy;
      const allPrice = pro.stock * pro.modal + product.total;
      const modal = Math.ceil(allPrice / stock);

      await Product.findByIdAndUpdate(product._id, {
        stock,
        modal,
      });
    });
  } else if (action === "addReturn") {
    cart.forEach(async (product) => {
      const pro = await Product.findById(product._id).populate("units");
      if (!pro) return;

      // const unitBuy = pro.unit[pro.units[pro.units.length - 1].name];

      const stock = pro.stock + product.qty * product.unitQty;
      const allPrice = pro.stock * pro.modal + product.total;
      const modal = Math.ceil(allPrice / stock);

      await Product.findByIdAndUpdate(product._id, {
        stock,
        modal,
      });
    });
  } else {
    return new Error("Tentukan aksi update stock");
  }
};

export const getAllSale = async (req, res) => {
  const status = req.query.status;
  const name = req.query.name;
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 0;

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
    let allPage = await Sale.find(query);
    allPage = Math.ceil(allPage.length / limit) - 1;
    const sales = await Sale.find(query)
      .populate("customer")
      .select("date time customer debt total invoice")
      .sort("-createdAt")
      .limit(limit)
      .skip(limit * page);

    const prev = page === 0 ? null : (page - 1).toString();
    const next = page + 1 > allPage ? null : (page + 1).toString();
    res.status(200).json({ data: sales, pages: { prev, next, page } });
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

    updateStock(sale.cart, "cut");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("customer");

    if (!sale) return res.sendStatus(404);

    res.status(200).json({ data: sale });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateSaleById = async (req, res) => {
  const { returnProduct, payCredit, ...payload } = req.body;

  try {
    await Sale.findOneAndUpdate({ _id: req.params.id }, payload);
    res.sendStatus(200);
    if (!payCredit) updateStock(returnProduct, "addReturn");
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteSaleById = async (req, res) => {
  const returnProduct = req.query.returnProduct;
  try {
    const saleDeleted = await Sale.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(200);

    if (returnProduct) {
      saleDeleted.cart.forEach(async (product) => {
        const pro = await Product.findById(product._id);
        if (!pro) return;

        const stock = pro.stock + product.qty * product.unitQty;
        const allPrice =
          pro.stock * pro.modal + product.qty * product.unitQty * product.modal;
        const modal = Math.ceil(allPrice / stock);
        await Product.findByIdAndUpdate(pro._id, { stock, modal });
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// const updateStock = (cart, action) => {
//   if (action === "min") {
//     cart.forEach(async (product) => {
//       const pro = await Product.findById(product._id);
//       if (!pro) return;
//       await Product.findByIdAndUpdate(product._id, {
//         stock: pro.stock - product.qty * product.unitQty,
//       });
//     });
//   } else {
//     cart.forEach(async (product) => {
//       const pro = await Product.findById(product._id);
//       if (!pro) return;

//       const stock = pro.stock + product.qty * product.unitQty;
//       const allPrice =
//         pro.stock * pro.modal + product.qty * product.unitQty * product.modal;
//       const modal = Math.ceil(allPrice / stock);

//       await Product.findByIdAndUpdate(product._id, {
//         stock,
//         modal,
//       });
//     });
//   }
// };

// export const payCredit = async (req, res) => {
//   try {
//     const sale = await Sale.findById(req.params.id);
//     const debt = req.body.value >= sale.debt ? 0 : sale.debt - req.body.value;
//     const payHistory = [
//       ...sale.payHistory,
//       { date: req.body.date, value: req.body.value },
//     ];
//     await Sale.findByIdAndUpdate(req.params.id, { debt, payHistory });
//     res.sendStatus(200);
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Internal server error" });
//   }
// };

// export const getDashboard = async (req, res) => {
//   const date = getDate().split(" ");
//   let salesToday = await Sale.find({ date: getDate() });
//   let salesYesterday = await Sale.find({ date: getDateYesterday() });
//   let salesMonth = await Sale.find({
//     date: new RegExp(`${date[1]} ${date[2]}`),
//   });
//   let allProduct = await Product.find();

//   const transaction = salesToday.length;
//   salesToday = salesToday.reduce((tot, num) => tot + num.total, 0);
//   salesYesterday = salesYesterday.reduce((tot, num) => tot + num.total, 0);
//   const profitMonth = salesMonth.reduce((tot, num) => tot + num.profit, 0);
//   salesMonth = salesMonth.reduce((tot, num) => tot + num.total, 0);
//   allProduct = allProduct.reduce((tot, num) => tot + num.stock * num.modal, 0);
//   res.status(200).json({
//     data: {
//       transaction,
//       salesToday,
//       salesYesterday,
//       profitMonth,
//       salesMonth,
//       allProduct,
//     },
//   });
// };
