import express from "express";
const route = express.Router();
import {
  login,
  verifyLogin,
  getUserById,
  logout,
  updateUserById,
  // createUser,
  // getAllUser,
} from "./controller.js";

route.post("/login", login);
route.get("/verify-login", verifyLogin);
route.get("/:id", getUserById);
route.patch("/:id", updateUserById);
route.delete("/logout", logout);
// route.post("/", createUser);

export default route;
