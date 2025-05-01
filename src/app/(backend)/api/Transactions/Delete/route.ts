import { NextResponse } from "next/server";
import { connectDB } from "../../../config/db";
import Transaction from "@/app/(backend)/model/Transaction";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function DELETE(req: Request) {
  try {
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json(
        { success: false, message: "Transaction _id is required." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(_id);

    if (!deletedTransaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found." },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
      data: deletedTransaction,
    }, { status: 200, headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Internal Server Error",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
