import { NextResponse } from "next/server";
import { prisma } from "@/lib/connectdb";
import dotenv from "dotenv";

dotenv.config();
export async function POST(req) {
    try {
        const { email } = await req.json();

        await prisma.$connect();

        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            return NextResponse.json({ exists: true }, { status: 200 });
        } else {
            return NextResponse.json({ exists: false }, { status: 200 });
        }
    } catch (error) {
        console.error(`Error checking user existence: ${error}`);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
