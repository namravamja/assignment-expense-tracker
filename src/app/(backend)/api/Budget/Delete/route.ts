import { NextResponse } from "next/server";
import { connectDB } from "../../../config/db";
import Budget from "@/app/(backend)/model/Budget";

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

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Budget ID is required" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const deletedBudget = await Budget.findByIdAndDelete(id);

    if (!deletedBudget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Failed to delete budget" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
