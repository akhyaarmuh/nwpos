import Customer from "./model.js";

export const getAllCustomer = async (req, res) => {
  try {
    const customers = await Customer.find()
      .sort("-createdAt")
      .select("name noHp address");

    res.status(200).json({ data: customers });
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
