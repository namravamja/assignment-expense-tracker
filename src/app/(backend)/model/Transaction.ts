import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to ensure correct amount sign based on transaction type
transactionSchema.pre("save", function (next) {
  if (this.type === "income" && this.amount < 0) {
    this.amount = Math.abs(this.amount);
  } else if (this.type === "expense" && this.amount > 0) {
    this.amount = -Math.abs(this.amount);
  }
  next();
});

// Helper virtual property to get absolute amount
transactionSchema.virtual("absoluteAmount").get(function () {
  return Math.abs(this.amount);
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
