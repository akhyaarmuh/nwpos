import Product from "./model.js";

const findMaxValueInObject = (obj) => {
  const arr = Object.values(obj);
  return Math.max(...arr);
};

export const createProduct = async (req, res) => {
  const product = await Product.findOne({ barcode: req.body.barcode });
  if (product)
    return res.status(400).json({ message: "Kode produk sudah digunakan" });

  const payload = { ...req.body };
  payload.name = payload.name.trim();
  payload.barcode = payload.barcode.trim();
  if (req.body.modal === 0 || req.body.stock === 0) {
    payload.modal = 0;
    payload.stock = 0;
  } else {
    payload.modal = Math.ceil(
      payload.modal / findMaxValueInObject(payload.unit)
    );
    payload.stock = payload.stock * findMaxValueInObject(payload.unit);
  }

  const newProduct = new Product(payload);
  try {
    await newProduct.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({
      barcode: req.params.barcode,
    })
      .populate("category units")
      .select(
        "barcode name category desc units modal stock unit price salePrice"
      );

    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    res.status(200).json({ data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllProduct = async (req, res) => {
  const page = Number(req.query.page) || 0;
  const limit = Number(req.query.limit) || 20;
  const keyword = req.query.keyword || "";
  const offset = limit * page;
  const sort = req.query.sort || "-createdAt";

  const query = {
    $or: [
      { name: new RegExp(keyword, "i") },
      { barcode: new RegExp(keyword, "i") },
    ],
  };

  try {
    const products = await Product.find(query);
    const rows = products.length;
    const allPage = Math.ceil(rows / limit);
    const data = await Product.find(query)
      .populate("category units")
      .sort(sort)
      .limit(limit)
      .skip(offset)
      .select(
        "barcode name category desc units modal stock unit price salePrice"
      );

    res.status(200).json({ data, page, limit, rows, allPage });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const barcodeUsed = await Product.findOne({ barcode: req.body.barcode });
    if (barcodeUsed && barcodeUsed._id.toString() !== req.params.id)
      return res.status(400).json({ message: "Kode produk sudah digunkan" });

    const { modal, ...payload } = req.body;

    if (payload.modalIsUpdate) {
      payload.modal = Math.ceil(modal / findMaxValueInObject(payload.unit));
    }
    payload.name = payload.name.trim();
    payload.barcode = payload.barcode.trim();

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
