import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
      required: [true],
    },
    date: {
      type: String,
      required: [true],
    },
    time: {
      type: String,
      required: [true],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    cart: {
      type: Array,
      required: [true],
    },
    total: {
      type: Number,
      required: [true],
    },
    profit: {
      type: Number,
      required: [true],
    },
    debt: {
      type: Number,
    },
    payHistory: {
      type: Array,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
