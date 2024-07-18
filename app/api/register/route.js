import dotenv from "dotenv";
import { NextResponse } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";
import bcrypt from "bcryptjs"

dotenv.config();
export async function POST(req) {
    try {
        const { data, id } = await req.json();
        const { password } = data;
        const hashedPassword = await bcrypt.hash(password, 10)
        const createdAt = new Date(); 

        await connectDB();

        const newUser = await prisma.user.create({
            data: {
                firebaseUid: id,
                name: data.name,
                email: data.email,
                password: hashedPassword,
                createdAt: createdAt,
            },
          });

        return NextResponse.json({ user: newUser }, { status: 200 });
    } catch (error) {
        console.error(`This is the Error of catch block in register is ${error}`);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}