import Product from "../app/product/model.js";

export default async () => {
  const products = await Product.find().populate("units");

  products.forEach(async (product) => {
    const units = product.units.map((unt) => unt.name);

    const unit = {};
    const price = {};
    const salePrice = {};
    const modal = Number(product.modal);
    const stock = Number(product.stock);
    let name = product.name.trim();
    const barcode = product.barcode.trim();
    let brokenPrice = false;
    let brokenUnit = false;

    units.forEach((unt, i) => {
      if (i === 0) {
        if (!product.price[unt]) brokenPrice = true;
        unit[unt] = 1;
        price[unt] = Number(product.price[unt]) || 0;
        salePrice[unt] = Number(product.salePrice[unt]) || 0;
      } else {
        if (!product.unit[unt]) brokenUnit = true;
        unit[unt] = Number(product.unit[unt]) || 0;
        price[unt] = Number(product.price[unt]) || 0;
        salePrice[unt] = Number(product.salePrice[unt]) || 0;
      }
    });

    if (brokenPrice || brokenUnit) {
      name = name + " broken";
      if (brokenUnit && brokenPrice) {
        name = name + "Satuan&Harga";
      } else {
        if (brokenUnit) {
          name = name + "Satuan";
        } else {
          name = name + "Harga";
        }
      }
    }

    await Product.findByIdAndUpdate(product._id, {
      unit,
      price,
      salePrice,
      modal,
      stock,
      name,
      barcode,
    });
  });
};
