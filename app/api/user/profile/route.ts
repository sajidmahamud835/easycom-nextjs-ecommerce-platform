import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    // Sentinel: Removed clerkUserId from body destructuring to prevent IDOR.
    // We must strictly use the authenticated userId.
    const { firstName, lastName, phone, dateOfBirth } = body;

    // Update or create user in Sanity
    const sanityUser = {
      _type: "user",
      clerkUserId: userId, // Always use authenticated userId
      email: "", // We'll get this from Clerk
      firstName,
      lastName,
      phone,
      dateOfBirth,
      updatedAt: new Date().toISOString(),
    };

    // Check if user exists in Sanity
    const existingUser = await backendClient.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: userId } // Always use authenticated userId
    );

    let result;
    if (existingUser) {
      // Update existing user
      result = await backendClient
        .patch(existingUser._id)
        .set({
          firstName,
          lastName,
          phone,
          dateOfBirth,
          updatedAt: new Date().toISOString(),
        })
        .commit();
    } else {
      // Create new user
      result = await backendClient.create({
        ...sanityUser,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: result,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
