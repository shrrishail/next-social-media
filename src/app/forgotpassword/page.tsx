'use client';

import { ILoginUser } from "@interfaces/user";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./forgot-password.module.css";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "@components/loader/Loader";
import { ISuccessResponse } from "@interfaces/networkCalls";

const Login = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mailSent, setMailSent] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [email, setEmail] = useState("");

    useEffect(() => {
        if(email) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [email])

    const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            const response: ISuccessResponse = await axios.post('/api/users/forgotpassword', {email});
            toast.success(response?.message || 'Password reset link sent');
            setMailSent(true);
        } catch (error: any) {
            console.log("Error login", error.message);
            toast.error('Could not login!');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='w-full'>
            <form className={styles.loginForm} onSubmit={handleResetPassword}>
                <h2 className="text-3xl font-semibold mb-8 text-center font-poppins">Forgot Password</h2>
                {
                    mailSent ? (
                        <p className="text-gray-300 mb-8 text-center">
                            We have sent you an email with the instructions to reset your password.
                        </p>
                    ) : (
                        <>
                            <p className="text-gray-300 mb-8">
                                We will send you an email with link to reset the password.
                            </p>
                            <label>Email</label>
                            <input 
                                type="text"
                                onChange={(e: ChangeEvent) => setEmail((e.target as HTMLInputElement).value)}
                                placeholder='Enter your email'
                                className={styles.formInput}
                                value={email}
                            />
            
                            <button 
                                className={`${styles.formButton} ${buttonDisabled ? styles.disabledButton : ''}`} 
                                disabled={buttonDisabled}
                            >
                                {
                                    isSubmitting ? (
                                        <Loader 
                                            color='#000'
                                        />
                                    ) : <span>Reset password</span>
                                }
                            </button>
            
                            <p className={styles.navigateLink}>
                                <Link href='/login'>
                                    Go to login page
                                </Link>
                            </p>
                        </>
                    )
                }
            </form>
        </div>
    )
}

export default Login