import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Users from "@/models/Users";

export async function POST(request: NextRequest) {
  try {
    // Never miss await as nextRequest is a special type of resquest
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User Already Exist" },
        { status: 400 }
      );
    }

    await Users.create({
      email,
      password,
    });

    return NextResponse.json(
      { message: "User Created Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Fail to Regester User" },
      { status: 500 }
    );
  }
}
