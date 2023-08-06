import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { IUserToken } from "@interfaces/networkCalls";

export const getTokenData = (request: NextRequest): string => {
    try {
        const token = request.cookies?.get('token')?.value;
        
        if(!token) return "";

        const decodedToken: IUserToken = jwt.verify(token, process.env.TOKEN_SECRET!) as IUserToken;
        return decodedToken?.id;
    } catch (error: any) {
        console.log("error in getting token data");
        console.log(error);
        throw new Error('User not authenticated.');
    }
}