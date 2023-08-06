import { connect } from "@db/config";
import User from "@db/models/user";
import { getTokenData } from "@helpers/token";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
        const userId = getTokenData(request);
        const user = await User.findById(userId).select('-password');

        if(!user) return NextResponse.json({error: "Could not find user"}, {status: 400});

        return NextResponse.json({
            message: 'User found',
            success: true,
            user
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
}