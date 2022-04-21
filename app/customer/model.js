import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
