import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      default: null
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      require: true
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["to-do", "in-progress", "done"],
      default: "to-do",
    },
    dueDate: {
      type: Date,
      default: null
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null
    },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
