import {
  checkIsUsed,
  findValueInObject,
  toRupiah,
  getKeyByValue,
} from "../../utilities/index.js";
import Product from "./model.js";

export const createProduct = async (req, res) => {
  const product = await Product.findOne({ barcode: req.body.barcode });
  if (product)
    return res.status(400).json({ message: "Barcode sudah digunakan" });

  const payload = { ...req.body };
  payload.modal = Math.ceil(
    payload.modal / findValueInObject(payload.unit, "max")
  );
  payload.stock = payload.stock * findValueInObject(payload.unit, "max");

  const newProduct = new Product(payload);
  try {
    await newProduct.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllProduct = async (req, res) => {
  const perPage = 20;
  const name = req.query.keyword || "";
  const page = Number(req.query.page) < 0 ? 0 : Number(req.query.page) || 0;
  try {
    let products = await Product.find({
      $or: [
        { name: new RegExp(name, "i") },
        { barcode: new RegExp(name, "i") },
      ],
    })
      .sort("-createdAt")
      .select(
        "barcode name category desc units unit stock modal price salePrice"
      )
      .populate("category units")
      .limit(perPage)
      .skip(perPage * page);

    products = products.map((product) => ({
      _id: product._id,
      barcode: product.barcode,
      name: product.name,
      category: { value: product.category._id, label: product.category.name },
      desc: product.desc,
      units: product.units.map((unt) => ({ value: unt._id, label: unt.name })),
      displayPrice: findValueInObject(product.price, "min"),
      displayStock: toRupiah(product.stock) + " " + product.units[0].name,
      price: product.price,
      salePrice: product.salePrice,
      unit: product.unit,
      stock: product.stock,
      modal: product.modal * findValueInObject(product.unit, "max"),
    }));

    res.status(200).json({ data: products, page });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getProductByBarcode = async (req, res) => {
  try {
    let product = await Product.findOne({
      barcode: req.params.barcode,
    }).populate("category units");
    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    if (product.stock === 0)
      return res.status(404).json({ message: "Stok produk habis" });

    const units = product.units.map((unt) => ({
      value: unt._id,
      label: unt.name,
    }));

    product = {
      _id: product._id,
      barcode: product.barcode,
      name: product.name,
      category: product.category.name,
      units,
      defaultUnit: units.find(
        (unt) =>
          unt.label ===
          getKeyByValue(product.unit, findValueInObject(product.unit, "min"))
      ),
      stock: product.stock,
      unit: product.unit,
      price: product.price,
      salePrice: product.salePrice,
      priceSelected: findValueInObject(product.price, "min"),
      qty: 1,
      total: findValueInObject(product.price, "min"),
      unitSelected: product.units[0].name,
      typeSale: "price",
      limitStock: product.stock,
      modal: product.modal,
      desc: product.desc,
      unitBuy: getKeyByValue(
        product.unit,
        findValueInObject(product.unit, "max")
      ),
    };
    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateProductById = async (req, res) => {
  const barcode = req.body.barcode;
  if (barcode) {
    const isUsed = await checkIsUsed(Product, "barcode", barcode);
    if (isUsed)
      return res.status(400).json({ message: "Barcode sudah digunakan" });
  }

  const payload = req.body;
  if (req.body.modal) {
    payload.modal = Math.ceil(
      payload.modal / findValueInObject(payload.unit, "max")
    );
  }

  try {
    await Product.findOneAndUpdate({ _id: req.params.id }, payload);
    res.sendStatus(200);
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

export const updateStockById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.sendStatus(500);
    if (req.body.key === "tambah") {
      await Product.findOneAndUpdate(
        { _id: product._id },
        { stock: product.stock + req.body.qty }
      );
    } else if (req.body.key === "kurang") {
      await Product.findOneAndUpdate(
        { _id: product._id },
        {
          stock:
            product.stock - req.body.qty < 0 ? 0 : product.stock - req.body.qty,
        }
      );
    }
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
