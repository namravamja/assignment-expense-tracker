import { NextResponse } from "next/server";
import { connectDB } from "../../../config/db";
import Transaction from "@/app/(backend)/model/Transaction";

connectDB();

export async function DELETE(req: Request) {
  try {
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json(
        { success: false, message: "Transaction _id is required." },
        { status: 400 }
      );
    }

    // Find the transaction by ID and delete it
    const deletedTransaction = await Transaction.findByIdAndDelete(_id);

    // If transaction doesn't exist
    if (!deletedTransaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
      data: deletedTransaction,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
