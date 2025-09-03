import mongoose, { Schema } from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      index: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],
  },
  { timestamps: true }
);

const boardModel = mongoose.model("Board", boardSchema);

export default boardModel;
