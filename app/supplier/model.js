import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true],
    },
    noHp: {
      type: String,
      required: [true],
    },
    address: {
      type: String,
      required: [true],
    },
    bank: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", supplierSchema);
