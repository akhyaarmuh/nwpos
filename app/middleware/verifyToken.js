import dotenv from "dotenv";
import User from "../user/model.js";
dotenv.config();

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not signature" });
  const user = await User.findOne({ token });
  if (!user) return res.status(403).json({ message: "Anda belum login" });
  jwt.verify(token, process.env.TOKEN, (err) => {
    if (err) return res.status(403).json({ message: "Signature is not valid" });
    next();
  });
};
