import Product from "../product/model.js";
import Sale from "../sale/model.js";
import { getDate, getDateYesterday } from "../../utilities/index.js";

export const getAll = async (req, res) => {
  try {
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
    allProduct = allProduct.reduce(
      (tot, num) => tot + num.stock * num.modal,
      0
    );
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
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
