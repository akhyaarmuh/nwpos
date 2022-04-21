import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
      required: [true, "Username wajib diisi"],
    },
    email: {
      type: String,
    },
    noHp: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
    },
    token: {
      type: String,
    },
    role: {
      type: String,
      default: "Cashier",
      enum: ["Admin", "Cashier"],
      required: [true, "role harus diisi"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
