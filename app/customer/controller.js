import Customer from "./model.js";

export const getAllCustomer = async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 0;

  try {
    const allPage = Math.ceil((await Customer.count()) / limit) - 1;
    const customers = await Customer.find()
      .sort("-createdAt")
      .select("name noHp address")
      .limit(limit)
      .skip(limit * page);

    const prev = page === 0 ? null : (page - 1).toString();
    const next = page + 1 > allPage ? null : (page + 1).toString();
    res.status(200).json({ data: customers, pages: { prev, next } });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteCustomerById = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const createCustomer = async (req, res) => {
  const payload = req.body;

  try {
    const available = await Customer.findOne({
      noHp: new RegExp(`^${payload.noHp}$`, "i"),
    });
    if (available)
      return res.status(400).json({ message: `Nomor Hp sudah digunakan` });

    const newCustomer = new Customer(payload);
    await newCustomer.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateCustomerById = async (req, res) => {
  const payload = req.body;
  const _id = req.params.id;
  try {
    const customer = await Customer.findOne({
      noHp: new RegExp(`^${payload.noHp}$`, "i"),
    });
    if (customer && customer._id.toString() !== _id)
      return res.status(400).json({ message: `Nomor Hp sudah digunakan` });

    await Customer.findOneAndUpdate({ _id }, payload);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
