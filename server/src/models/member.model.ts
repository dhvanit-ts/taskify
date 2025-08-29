import mongoose, { Schema } from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        index: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
  },
  { timestamps: true }
);

const memberModel = mongoose.model("Member", memberSchema);

export default memberModel;