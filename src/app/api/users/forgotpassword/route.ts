import { connect } from "@db/config";
import User from "@db/models/user";
import { sendMail } from "@helpers/mailer";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const {email} = await request.json();

        const user = await User.findOne({email});
        if(!user) {
            return NextResponse.json({error: "User with provided email does not exist!"}, {status: 500});
        }
        
        //create a token
        sendMail({
            emailType: 'FORGOT_PASSWORD',
            recipient: user.email,
            userId: user._id,
            subject: "Request for change of password",
        });
        
        return NextResponse.json({
            message: "Successfully created the user",
            success: true,
        })
    } catch (error: any) {
        console.log("Forgot password");
        console.log(error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}