import mongoose from "mongoose";

const buySchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      // required: [true, "Agen harus diisi"],
    },
    cart: [
      {
        type: Object,
        required: [true, "Barang dibeli harus diisi"],
      },
    ],
    date: {
      type: String,
      required: [true, "date harus diisi"],
    },
    time: {
      type: String,
      required: [true, "time Harus diisi"],
    },
    total: {
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

export default mongoose.model("Buy", buySchema);
