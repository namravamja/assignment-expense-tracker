import { NextResponse } from "next/server";
import { connectDB } from "../../../config/db";
import Transaction from "@/app/(backend)/model/Transaction";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { amount, date, type, description, category } = await req.json();

    if (!amount || !date || !description) {
      return NextResponse.json(
        { error: "Amount, date, and description are required." },
        { status: 400 }
      );
    }

    const newTransaction = await Transaction.create({
      amount,
      date,
      type,
      description,
      category: category || "Uncategorized",
    });

    return NextResponse.json(
      { message: "Transaction added", transaction: newTransaction },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error adding transaction:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
