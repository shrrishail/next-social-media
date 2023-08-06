import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

import { connect } from "@db/config"
import User from "@db/models/user";
import { sendMail } from "@helpers/mailer";

connect();

export async function POST( request: NextRequest ) {
    try {
        const requestBody = await request.json();
        const { username, password, email } = requestBody;

        //check if user already exists with the email
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return NextResponse.json({error: 'User already exisits with that email!'}, {status: 400});
        }

        //hashing the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            email, password: hashedPassword, username
        });

        const savedUser = await newUser.save();

        //send email
        sendMail({
            recipient: savedUser.email,
            emailType: "ACCOUNT_VERIFICATION",
            userId: newUser._id,
            subject: "Please verify you email",
        });
        
        return NextResponse.json({
            message: "Successfully created the user",
            success: true,
            user: savedUser
        })

    } catch (error) {
        return NextResponse.json({error}, {status: 500});
    }
} 