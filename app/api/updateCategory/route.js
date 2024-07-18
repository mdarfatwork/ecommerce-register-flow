import { NextResponse } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";

export async function POST(req) {
  try {
    const { email, id } = await req.json();

    if (!email || !id) {
      return NextResponse.json({ error: "Email and category ID required" }, { status: 400 });
    }

    await connectDB();

    const userInterest = await prisma.userInterest.findUnique({
      where: { email },
    });

    if (!userInterest) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const interests = userInterest.interests;

    const updatedInterests = interests.map(category => 
      category.id === id ? { ...category, checked: !category.checked } : category
    );

    const updatedUserInterest = await prisma.userInterest.update({
      where: { email },
      data: {
        interests: updatedInterests,
      },
    });

    return NextResponse.json({ userInterest: updatedUserInterest }, { status: 200 });
  } catch (error) {
    console.error(`Error updating category: ${error}`);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}