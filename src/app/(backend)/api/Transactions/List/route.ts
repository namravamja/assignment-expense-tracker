import { NextResponse } from "next/server";
import { connectDB } from "../../../config/db";
import Transaction from "@/app/(backend)/model/Transaction";

export async function GET() {
  try {
    await connectDB();

    const transactions = await Transaction.find();

    return NextResponse.json(transactions, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching transactions:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch transactions." },
      { status: 500 }
    );
  }
}
