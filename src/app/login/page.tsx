'use client';

import { ILoginUser } from "@interfaces/user";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./login-styles.module.css";
import Link from "next/link";
import { Metadata } from "next";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "@components/loader/Loader";
import { ISuccessResponse } from "@interfaces/networkCalls";

// export const metadata: Metadata = {
//     title: 'Login to Authentication',
//     description: 'Authentication is an app created to replicate a social media platform'
// }

const Login = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [formData, setFormData] = useState<ILoginUser>({
        email: '',
        password: '',
    });

    useEffect(() => {
        if(formData.email && formData.password) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [formData.email, formData.password])

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            const response: ISuccessResponse = await axios.post('/api/users/login', formData);
            toast.success(response?.message || 'Login successful');
            router.push('/profile');
        } catch (error: any) {
            console.log("Error login", error.message);
            toast.error('Could not login!');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='w-full'>
            <form className={styles.loginForm} onSubmit={handleLogin}>
                <h2 className="text-3xl font-semibold mb-8 text-center font-poppins">Login</h2>
                <label>Email</label>
                <input 
                    type="text"
                    onChange={(e: ChangeEvent) => setFormData({
                        ...formData, 
                        email: (e.target as HTMLInputElement).value
                    })}
                    placeholder='Enter a username'
                    className={styles.formInput}
                    value={formData.email}
                />

                <label>Password</label>
                <input 
                    type="password"
                    onChange={(e: ChangeEvent) => setFormData({
                        ...formData, 
                        password: (e.target as HTMLInputElement).value
                    })}
                    placeholder='Enter a secure password'
                    className={styles.formInput}
                    value={formData.password}
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
                        ) : <span>Login</span>
                    }
                </button>

                <p className={styles.navigateLink}>
                    <Link href='/signup'>
                        Don't have an account ? Signup.
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login