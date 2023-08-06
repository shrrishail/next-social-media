import bcryptjs from 'bcryptjs';

import { NextRequest, NextResponse } from "next/server";
import User from "@db/models/user";

export async function POST(request: NextRequest) {
    try {
        const {password, token} = await request.json();

        const user = await User.findOne({
            forgotPasswordToken: token, 
            forgotPasswordTokenExpiry: {$gt: Date.now()}
        });

        if(!user) {
            return NextResponse.json({error: "User with provided email does not exist!"}, {status: 500});
        }

        //hash the new password and save
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        await user.save();
        
        return NextResponse.json({
            message: "Successfully changed the password",
            success: true,
        })
    } catch (error: any) {
        console.log("Reset password");
        console.log(error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}