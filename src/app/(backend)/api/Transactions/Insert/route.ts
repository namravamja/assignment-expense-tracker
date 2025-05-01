import { NextResponse } from "next/server";
import { connectDB } from "../../../config/db";
import Transaction from "@/app/(backend)/model/Transaction";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: CORS_HEADERS,
    }
  );
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { amount, date, type, description, category } = await req.json();

    if (!amount || !date || !description) {
      return NextResponse.json(
        { error: "Amount, date, and description are required." },
        { status: 400, headers: CORS_HEADERS }
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
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (error: unknown) {
    console.error("Error adding transaction:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
