import bcrypt from "bcrypt";
import Store from "./model.js";
import User from "../user/model.js";

export const getStore = async (req, res) => {
  try {
    const store = await Store.find();
    res.status(200).json({ data: store[0] });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateStore = async (req, res) => {
  const { password, ...payload } = req.body;
  try {
    const admin = await User.findOne({ role: "Admin" });
    const matchPassword = await bcrypt.compare(password, admin.password);
    // jika password salah
    if (!matchPassword) {
      return res.status(404).json({ message: "Katasandi salah" });
    }

    const store = await Store.find();
    await Store.findOneAndUpdate({ _id: store[0]._id }, payload);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
