import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
      required: [true],
    },
    cart: [
      {
        type: Object,
        required: [true],
      },
    ],
    date: {
      type: String,
      required: [true],
    },
    time: {
      type: String,
      required: [true],
    },
    profit: {
      type: Number,
      required: [true],
    },
    total: {
      type: Number,
      required: [true],
    },
    debt: {
      type: Number,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    payHistory: {
      type: Array,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
