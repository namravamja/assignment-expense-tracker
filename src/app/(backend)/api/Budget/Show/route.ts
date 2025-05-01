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

export async function GET() {
  try {
    await connectDB();
    const budgets = await Budget.find({}).sort({ createdAt: -1 });

    return NextResponse.json(budgets, { status: 200, headers: CORS_HEADERS });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Failed to fetch budgets" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
