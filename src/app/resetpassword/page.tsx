'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./reset-password.module.css";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "@components/loader/Loader";
import { ISuccessResponse } from "@interfaces/networkCalls";

const Login = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    
    let token = "";

    useEffect(() => {
        if(formData.password && formData.confirmPassword && formData.password == formData.confirmPassword) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [formData.password, formData.confirmPassword])

    const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = searchParams.get('token') || '';

        try {
            setIsSubmitting(true);
            const response: ISuccessResponse = await axios.post(
                '/api/users/resetpassword', 
                {password: formData.password, token}
            );
            toast.success(response?.message || 'Password reset link sent');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
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
                <h2 className="text-3xl font-semibold mb-8 text-center font-poppins">
                    Reset Password
                </h2>
                <label>Password</label>
                <input 
                    type="password"
                    onChange={(e: ChangeEvent) => setFormData({
                        ...formData,
                        password: (e.target as HTMLInputElement).value
                    })}
                    placeholder='Enter new password'
                    className={styles.formInput}
                    value={formData.password}
                />
                
                <label>Confirm Password</label>
                <input 
                    type="password"
                    onChange={(e: ChangeEvent) => setFormData({
                        ...formData,
                        confirmPassword: (e.target as HTMLInputElement).value
                    })}
                    placeholder='Confirm new password'
                    className={styles.formInput}
                    value={formData.confirmPassword}
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
            
            </form>
        </div>
    )
}

export default Login