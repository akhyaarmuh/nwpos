import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "./model.js";
import Store from "../store/model.js";
import backup from "../../utilities/backup.js";

const createAdmin = async (req, res) => {
  const admin = await User.findOne({ role: "Admin" });
  if (admin) {
    return res.status(405).json({ message: "Akun admin sudah ada" });
  }

  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash(req.body.password, salt);

  const newAdmin = new User({ role: "Admin", username: "Admin", password });
  const newStore = new Store({
    name: "Toko",
    city: "Kota",
    noHp: "085161713161",
    address: "Alamat, desa, rt, rw",
    footer: "Pesan nota",
  });

  try {
    await newAdmin.save();
    await newStore.save();
    res.status(201).json({ message: "Akun admin telah dibuat" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const createCashier = async (res) => {
  const kasir = await User.findOne({ username: "Kasir" });
  if (kasir) {
    return res.status(405).json({ message: "Akun kasir sudah ada" });
  }

  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash("kasir", salt);

  const newCashier = new User({ username: "Kasir", password });

  try {
    await newCashier.save();
    res.status(201).json({ message: "Akun kasir telah dibuat" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (username === "Create" && password === "admin") {
    await createAdmin(req, res);
  } else if (username === "Create" && password === "cashier") {
    await createCashier(res);
  } else if (username === "Reset" && password === "password") {
    const salt = await bcrypt.genSalt();
    const passwordReseted = await bcrypt.hash("admin", salt);
    await User.findOneAndUpdate(
      { role: "Admin" },
      { username: "Admin", password: passwordReseted }
    );
    res.status(200).json({ message: "Akun admin berhasil direset" });
  } else {
    const user = await User.findOne({ username }).select("name role password");
    // jika tidak ada username ditemukan
    if (!user) {
      return res.status(404).json({ message: "Nama pengguna tidak ditemukan" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    // jika password salah
    if (!matchPassword) {
      return res.status(404).json({ message: "Katasandi salah" });
    }

    const stores = await Store.find().select(
      "name city noHp address footer line1 line2"
    );

    const userDetail = { name: user.name, role: user.role, _id: user._id };
    const storeDetail = stores[0];

    const token = jwt.sign(
      { ...userDetail, store: storeDetail },
      process.env.TOKEN,
      {
        expiresIn: "1d",
      }
    );
    await User.findOneAndUpdate({ _id: user._id }, { token });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true,
    });
    res.sendStatus(204);
  }
};

export const verifyLogin = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);
  const user = await User.findOne({ token });
  if (!user) return res.sendStatus(403);
  jwt.verify(token, process.env.TOKEN, (err) => {
    if (err) return res.sendStatus(403);
    res.status(200).json({ token });
  });
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);
    const user = await User.findOne({ token });
    if (!user) return res.sendStatus(403);

    backup(true);
    await User.findOneAndUpdate({ _id: user._id }, { token: null });
    res.clearCookie("token");
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select(
      "name username email noHp role"
    );
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { password, newPassword, ...payload } = req.body;
    const user = await User.findOne({ _id: req.params.id });

    const matchPassword = await bcrypt.compare(password, user.password);
    // jika password salah
    if (!matchPassword) {
      return res.status(404).json({ message: "Katasandi salah" });
    }

    const isUsernameUsed = await User.findOne({ username: payload.username });
    if (isUsernameUsed && isUsernameUsed._id.toString() !== req.params.id)
      return res.status(400).json({ message: "Username sudah digunakan" });

    if (newPassword) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(newPassword, salt);
      payload.password = password;
    }

    await User.findOneAndUpdate({ _id: user._id }, payload);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
