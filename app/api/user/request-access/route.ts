import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, firstName, lastName } = body;

    // Use the authenticated user ID strictly to prevent IDOR
    const clerkUserId = userId;

    // Check if user request already exists
    const existingRequest = await backendClient.fetch(
      `*[_type == "userAccessRequest" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId }
    );

    if (existingRequest) {
      return NextResponse.json({
        success: false,
        message: "Access request already exists",
      });
    }

    // Create access request in Sanity
    const accessRequest = await backendClient.create({
      _type: "userAccessRequest",
      clerkUserId,
      email,
      firstName,
      lastName,
      status: "pending",
      requestedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      notes: "",
    });

    return NextResponse.json({
      success: true,
      message: "Access request submitted successfully",
      requestId: accessRequest._id,
    });
  } catch (error) {
    console.error("Error creating access request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
