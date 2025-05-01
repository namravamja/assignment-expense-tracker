import { NextResponse } from "next/server";
import { connectDB } from "../../../config/db";
import Transaction from "@/app/(backend)/model/Transaction";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

connectDB();

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, message: "Transaction _id is required." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found." },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, transaction: updatedTransaction },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
