import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      required: [true],
    },
    name: {
      type: String,
      required: [true],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true],
    },
    desc: {
      type: String,
    },
    units: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required: [true],
      },
    ],
    modal: {
      type: Number,
      required: [true],
    },
    stock: {
      type: Number,
      default: 0,
      // required: [true],
    },
    unit: {
      type: Object,
      required: [true],
    },
    price: {
      type: Object,
      required: [true],
    },
    salePrice: {
      type: Object,
      required: [true],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
