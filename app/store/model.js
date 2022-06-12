import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true],
    },
    city: {
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
    footer: {
      type: String,
      required: [true],
    },
    line1: {
      type: String,
      maxlength: 20,
    },
    line2: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Store", storeSchema);
