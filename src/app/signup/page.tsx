'use client';

import { ISignupUser } from '@interfaces/user';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import styles from './signup-styles.module.css';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '@components/loader/Loader';

const SignUp = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const [formData, setFormData] = useState<ISignupUser>({
        email: '',
        password: '',
        username: ''
    });

    useEffect(() => {
        if(formData.email && formData.password && formData.username) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [formData.email, formData.password, formData.username])

    const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            setIsSubmitting(true);
            const response = await axios.post('/api/users/signup', formData);
            router.push('/login')
        } catch(error: any) {
            console.log("Signup failed -", error.message);
            toast.error('Error occurred while creating account!');
        } finally{
            setIsSubmitting(false);
        }
    }

    return (
        <div className='w-full'>
            <form className={styles.signupForm} onSubmit={handleSignup}>
                <label>Email</label>
                <input 
                    type="email"
                    onChange={(e: ChangeEvent) => setFormData({
                        ...formData, 
                        email: (e.target as HTMLInputElement).value
                    })}
                    placeholder='abcd@example.com'
                    className={styles.formInput}
                    value={formData.email}
                />

                <label>Username</label>
                <input 
                    type="text"
                    onChange={(e: ChangeEvent) => setFormData({
                        ...formData, 
                        username: (e.target as HTMLInputElement).value
                    })}
                    placeholder='Enter a username'
                    className={styles.formInput}
                    value={formData.username}
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

                <button className={`${styles.formButton} ${buttonDisabled ? styles.disabledButton : ''}`} disabled={buttonDisabled}>
                    {
                        isSubmitting ? (
                            <Loader 
                                color='#000'
                            />
                        ) : <span>Sign up</span>
                    }
                </button>

                <p className={styles.navigateLink}>
                    <Link href='/login'>
                        Already have an account ? Login.
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default SignUp