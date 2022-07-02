import Product from "../app/product/model.js";

export default async () => {
  const products = await Product.find().populate("units");

  products.forEach(async (product) => {
    const units = product.units.map((unt) => ({
      name: unt.name,
      _id: unt._id,
    }));

    const unit = {};
    const price = {};
    const salePrice = {};

    units.forEach((unt) => {
      unit[unt._id] = product.unit[unt.name];
      price[unt._id] = product.price[unt.name];
      salePrice[unt._id] = product.salePrice[unt.name];
    });

    await Product.findByIdAndUpdate(product._id, {
      unit,
      price,
      salePrice,
    });
  });
};

export const markProduct = async () => {
  const products = await Product.find();

  products.forEach(async (product) => {
    const name = product.name + " nc";
    await Product.findByIdAndUpdate(product._id, { name });
  });
};
