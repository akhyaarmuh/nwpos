import express from "express";
import {
  login,
  verifyLogin,
  logout,
  getUserById,
  updateUserById,
} from "./controller.js";

const route = express.Router();

route.post("/login", login);
route.get("/verify-login", verifyLogin);
route.delete("/logout", logout);
route.get("/:id", getUserById);
route.patch("/:id", updateUserById);

export default route;
