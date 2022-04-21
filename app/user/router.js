import express from "express";
const route = express.Router();
import {
  // createUser,
  // getAllUser,
  login,
  verifyLogin,
  getUserById,
  logout,
  updateUserById,
} from "./controller.js";

// route.post("/", createUser);
route.post("/login", login);
route.get("/verify-login", verifyLogin);
route.get("/:id", getUserById);
route.patch("/:id", updateUserById);
route.delete("/logout", logout);

export default route;
