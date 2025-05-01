import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "food",
        "housing",
        "transportation",
        "utilities",
        "insurance",
        "healthcare",
        "entertainment",
        "personal",
        "education",
        "income",
        "other",
      ],
    },
    maxAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate budgets for same category/month/year
budgetSchema.index({ category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);

export default Budget;
