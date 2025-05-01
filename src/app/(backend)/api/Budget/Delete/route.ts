import { NextResponse } from "next/server";
import { connectDB } from "../../../config/db";
import Budget from "@/app/(backend)/model/Budget";

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Budget ID is required" },
        { status: 400 }
      );
    }

    // Delete budget
    const deletedBudget = await Budget.findByIdAndDelete(id);

    if (!deletedBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete budget" },
      { status: 500 }
    );
  }
}
