import User from "@db/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {token} = body;

        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});

        if(!user) return NextResponse.json({error: "User not found!"}, {status: 400});

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message: "Email verified successfully!",
            success: true
        })

    } catch (error: any) {
        console.log("BE - verification error");
        console.log(error);
        return NextResponse.json({error: error.message}, {status: 400});
    }
}