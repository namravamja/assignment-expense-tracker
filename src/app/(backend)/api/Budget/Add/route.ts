import { NextResponse } from "next/server";
import { connectDB } from "../../../config/db";
import Budget from "@/app/(backend)/model/Budget";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const { category, maxAmount } = body;

    if (!category || maxAmount === undefined) {
      return NextResponse.json(
        { error: "Category and maxAmount are required" },
        { status: 400 }
      );
    }

    // Create new budget
    const budget = await Budget.create({
      category,
      maxAmount,
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error: any) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Budget for this category already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to add budget" },
      { status: 500 }
    );
  }
}
