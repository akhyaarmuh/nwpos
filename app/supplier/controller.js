import Supplier from "./model.js";

export const getAllSupplier = async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 0;

  try {
    const allPage = Math.ceil((await Supplier.count()) / limit) - 1;
    const suppliers = await Supplier.find()
      .sort("-createdAt")
      .limit(limit)
      .skip(limit * page);

    const prev = page === 0 ? null : (page - 1).toString();
    const next = page + 1 > allPage ? null : (page + 1).toString();
    res.status(200).json({ data: suppliers, pages: { prev, next } });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteSupplierById = async (req, res) => {
  try {
    // const using = await Product.findOne({ category: req.params.id });
    // if (using)
    //   return res.status(405).json({ message: "Kategori sedang digunakan" });

    await Supplier.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const createSupplier = async (req, res) => {
  const payload = req.body;

  try {
    const available = await Supplier.findOne({
      noHp: new RegExp(`^${payload.noHp}$`, "i"),
    });
    if (available)
      return res.status(400).json({ message: `Nomor Hp sudah digunakan` });

    const newSupplier = new Supplier(payload);
    await newSupplier.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateSupplierById = async (req, res) => {
  const payload = req.body;
  const _id = req.params.id;
  try {
    const supplier = await Supplier.findOne({
      noHp: new RegExp(`^${payload.noHp}$`, "i"),
    });
    if (supplier && supplier._id.toString() !== _id)
      return res.status(400).json({ message: `Nomor Hp sudah digunakan` });

    await Supplier.findOneAndUpdate({ _id }, payload);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
