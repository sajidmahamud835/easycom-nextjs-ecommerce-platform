import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isUserAdmin } from "@/lib/adminUtils";
import { client } from "@/sanity/lib/client";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const clerk = await clerkClient();
        const currentUser = await clerk.users.getUser(userId);
        const userEmail = currentUser.primaryEmailAddress?.emailAddress;

        if (!userEmail || !isUserAdmin(userEmail)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const brands = await client.fetch(`
      *[_type == "brand"] | order(title asc) {
        _id,
        title,
        slug
      }
    `);

        return NextResponse.json({ brands });
    } catch (error) {
        console.error("Error fetching brands:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
