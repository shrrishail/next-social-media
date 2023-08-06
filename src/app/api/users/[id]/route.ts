import { connect } from "@db/config";
import User from "@db/models/user";
import { getTokenData } from "@helpers/token";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
    try {
        //get the user id and find in database;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');
        const user = await User.findById(userId);

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