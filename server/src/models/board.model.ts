import mongoose, { Schema } from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        require: true
    },
  },
  { timestamps: true }
);

const boardModel = mongoose.model("Board", boardSchema);

export default boardModel;