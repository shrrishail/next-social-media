import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { connect } from "@db/config"
import User from "@db/models/user";

connect();

export async function POST( request: NextRequest ) {
    try {
        const requestBody = await request.json();
        const { password, email } = requestBody;

        console.log({requestBody});

        //check if user already exists with the email
        const existingUser = await User.findOne({email});
        if(!existingUser) {
            return NextResponse.json({error: 'User with provided email does not exist!'}, {status: 400});
        }

        //check password
        const isPasswordValid = await bcryptjs.compare(password, existingUser.password);

        if(!isPasswordValid) {
            return NextResponse.json({error: 'Password is incorrect!'}, {status: 400});
        }

        //create token
        const tokenData = {
            id: existingUser._id,
            email: existingUser.email,
            username: existingUser.username
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d'});
        const response = NextResponse.json({
            message: 'Logged in successfully!',
            success: true,
        });
        response.cookies.set("token", token, {
            httpOnly: true,
        });
        
        return response;

    } catch (error: any) {
        console.log("Login error BE");
        console.log(error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
} 