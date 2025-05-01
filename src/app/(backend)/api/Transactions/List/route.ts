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

export async function GET() {
  try {
    await connectDB();

    const transactions = await Transaction.find();

    return NextResponse.json(transactions, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error: unknown) {
    console.error("Error fetching transactions:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch transactions." },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
