import { NextResponse } from "next/server";
import { connectDB } from "../../../config/db";
import Budget from "@/app/(backend)/model/Budget";

export async function GET() {
  try {
    await connectDB();

    // Get all budgets
    const budgets = await Budget.find({}).sort({ createdAt: -1 });

    return NextResponse.json(budgets, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}
