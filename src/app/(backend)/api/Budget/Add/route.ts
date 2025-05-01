import { NextResponse } from "next/server";
import { connectDB } from "../../../config/db";
import Budget from "@/app/(backend)/model/Budget";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle CORS preflight request
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: CORS_HEADERS,
    }
  );
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const { category, maxAmount } = body;

    if (!category || maxAmount === undefined) {
      return NextResponse.json(
        { error: "Category and maxAmount are required" },
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      );
    }

    const budget = await Budget.create({
      category,
      maxAmount,
    });

    return NextResponse.json(budget, {
      status: 201,
      headers: CORS_HEADERS,
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "Budget for this category already exists" },
        {
          status: 409,
          headers: CORS_HEADERS,
        }
      );
    }

    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Failed to add budget" },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
