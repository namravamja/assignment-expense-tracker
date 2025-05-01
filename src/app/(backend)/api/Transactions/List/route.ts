import { NextResponse } from "next/server";
import { connectDB } from "../../../config/db";
import Transaction from "@/app/(backend)/model/Transaction";

connectDB();

export async function GET(req: Request) {
  try {
    const transactions = await Transaction.find();

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
