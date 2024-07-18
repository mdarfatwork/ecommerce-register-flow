import { NextResponse } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";
import { faker } from '@faker-js/faker';

function generateUniqueCategories(count) {
  const categories = [];
  for (let i = 0; i < count; i++) {
      switch (i % 3) {
          case 0:
              categories.push({ id: i + 1, category: faker.commerce.product(), checked: false });
              break;
          case 1:
              categories.push({ id: i + 1, category: faker.commerce.productMaterial(), checked: false });
              break;
          case 2:
              categories.push({ id: i + 1, category: faker.commerce.department(), checked: false });
              break;
          default:
              break;
      }
  }
  return categories;
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await connectDB();
    const createdAt = new Date();

    const userInterest = await prisma.userInterest.findUnique({
      where: { email },
    });

    if (userInterest) {
      return NextResponse.json({ userInterest }, { status: 200 });
    } else {
      const userInterest = await prisma.userInterest.create({
        data: {
          email: email,
          interests: generateUniqueCategories(100),
          createdAt: createdAt,
        },
      });
      return NextResponse.json({ userInterest }, { status: 200 });
    }
  } catch (error) {
    console.error(`This is the Error ${error}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
