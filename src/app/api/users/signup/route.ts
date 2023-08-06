import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

import { connect } from "@db/config"
import User from "@db/models/user";

connect();

export async function POST( request: NextRequest ) {
    try {
        const requestBody = await request.json();
        const { username, password, email } = requestBody;

        console.log({requestBody});

        //check if user already exists with the email
        const exisitngUser = await User.findOne({email});
        if(exisitngUser) {
            return NextResponse.json({error: 'User already exisits with that email!'}, {status: 400});
        }

        //hashing the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            email, password: hashedPassword, username
        });

        const savedUser = await newUser.save();
        console.log({savedUser});

        //send email
        
        return NextResponse.json({
            message: "Successfully created the user",
            success: true,
            user: savedUser
        })

    } catch (error) {
        console.log("error signup")
        console.log(error);
        return NextResponse.json({error}, {status: 500});
    }
} 