import Supplier from "./model.js";

export const getAllSupplier = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .sort("-createdAt")
      .select("name noHp address bank");

    res.status(200).json({ data: suppliers });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteSupplierById = async (req, res) => {
  try {
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
