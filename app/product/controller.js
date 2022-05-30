import {
  findValueInObject,
  // checkIsUsed,
  // toRupiah,
  // getKeyByValue,
} from "../../utilities/index.js";
import Product from "./model.js";

export const getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({
      barcode: req.params.barcode,
    }).populate("category units");

    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    res.status(200).json({ data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllProduct = async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 0;
  const name = req.query.search || "";
  // const barcode = req.query.barcode || "";

  const query = {
    $or: [{ name: new RegExp(name, "i") }, { barcode: new RegExp(name, "i") }],
  };

  try {
    let allPage = await Product.find(query);
    allPage = Math.ceil(allPage.length / limit) - 1;
    const products = await Product.find(query)
      .populate("category units")
      .sort("-createdAt")
      .limit(limit)
      .skip(limit * page);

    const prev = page === 0 ? null : (page - 1).toString();
    const next = page + 1 > allPage ? null : (page + 1).toString();

    res.status(200).json({ data: products, pages: { prev, next, page } });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const createProduct = async (req, res) => {
  const product = await Product.findOne({ barcode: req.body.barcode });
  if (product)
    return res.status(400).json({ message: "Kode produk sudah digunakan" });

  const payload = { ...req.body };
  if (req.body.modal === 0 || req.body.stock === 0) {
    payload.modal = 0;
    payload.stock = 0;
  } else {
    payload.modal = Math.ceil(
      payload.modal / findValueInObject(payload.unit, "max")
    );
    payload.stock = payload.stock * findValueInObject(payload.unit, "max");
  }

  const newProduct = new Product(payload);
  try {
    await newProduct.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const barcodeUsed = await Product.findOne({ barcode: req.body.barcode });
    if (barcodeUsed && barcodeUsed._id.toString() !== req.params.id)
      return res.status(400).json({ message: "Kode produk sudah digunkan" });

    const payload = { ...req.body };
    if (req.body.modal) {
      payload.modal = Math.ceil(
        payload.modal / findValueInObject(payload.unit, "max")
      );
    }

    await Product.findOneAndUpdate({ _id: req.params.id }, payload);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// export const getProductByBarcodeBuy = async (req, res) => {
//   try {
//     let product = await Product.findOne({
//       barcode: req.params.barcode,
//     }).populate("category units");
//     if (!product)
//       return res.status(404).json({ message: "Produk tidak ditemukan" });

//     const units = product.units.map((unt) => ({
//       value: unt._id,
//       label: unt.name,
//     }));

//     product = {
//       _id: product._id,
//       barcode: product.barcode,
//       name: product.name,
//       category: product.category.name,
//       units,
//       defaultUnit: units.find(
//         (unt) =>
//           unt.label ===
//           getKeyByValue(product.unit, findValueInObject(product.unit, "min"))
//       ),
//       stock: product.stock,
//       unit: product.unit,
//       price: product.price,
//       salePrice: product.salePrice,
//       priceSelected: findValueInObject(product.price, "min"),
//       qty: 1,
//       total: findValueInObject(product.price, "min"),
//       unitSelected: product.units[0].name,
//       typeSale: "price",
//       limitStock: product.stock,
//       modal: product.modal,
//       desc: product.desc,
//       unitBuy: getKeyByValue(
//         product.unit,
//         findValueInObject(product.unit, "max")
//       ),
//     };
//     res.status(200).json({ data: product });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Internal server error" });
//   }
// };

// export const updateStockById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.sendStatus(500);
//     if (req.body.key === "tambah") {
//       await Product.findOneAndUpdate(
//         { _id: product._id },
//         { stock: product.stock + req.body.qty }
//       );
//     } else if (req.body.key === "kurang") {
//       await Product.findOneAndUpdate(
//         { _id: product._id },
//         {
//           stock:
//             product.stock - req.body.qty < 0 ? 0 : product.stock - req.body.qty,
//         }
//       );
//     }
//     res.sendStatus(200);
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Internal server error" });
//   }
// };
