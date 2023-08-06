'use client';;

import Loader from "@components/loader/Loader";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token') || '';
        verifyUserMail(tokenFromUrl);
    }, [])

    const verifyUserMail = async (token: string) => {
        try {
            await axios.post(`/api/users/verifyemail`, {token});
            toast.success("Email verification successfull!");
            setTimeout(() => {
                router.push('/');
            }, 5000);
        } catch (error: any) {
            console.log("Error while verifying token");
            console.log(error);
            toast.error("Could not verify email");
        } finally{
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h2 className="text-2xl">Verifying email</h2>
            <div className="mt-2">
                {
                    loading ? (
                        <Loader color="#fff" />
                    ) : (
                        <span className="text-gray-400">
                            Your email could not be verified. 
                            Please refresh the page or try again later.
                        </span>
                    )
                }
            </div>
        </div>
    )
}

export default VerifyEmail