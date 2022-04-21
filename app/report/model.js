import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    moment: {
      type: String,
      required: [true],
    },
    sale: {
      type: Number,
      required: [true],
    },
    profit: {
      type: Number,
      required: [true],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
