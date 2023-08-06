'use client';

import { IRegisteredUser } from "@interfaces/user";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Profile = () => {
    const router = useRouter();
    const [userData, setUserData] = useState<IRegisteredUser>({
        _id: "",
        email: "",
        username: "",
        isVerified: false,
        isAdmin: false
    })

    const handleLogout = async () => {
        try {
            await axios.post('/api/users/logout');
            toast.success('Logged out successfully!');
            router.push('/login');
        } catch (error: any) {
            toast.error('Could not logout!');
        }
    }

    useEffect(() => {
      const getUserData = async () => {
        try {
            const response = await axios.get('/api/users/me');
            setUserData(response.data.user);
        } catch (error: any) {
            console.log("Could not get user data!");
        }
      }

      getUserData();
    }, [])
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile page</h1>
            <hr />
            <p>Profile</p>
            <span className="text-center bg-purple-200 rounded-md text-black p-2">{userData?._id ? (
                <span>
                    {userData._id}
                    <br />
                    {userData.email}
                </span>
            ) : ""}</span>
            <hr />
            <button 
                className="mt-4 bg-purple-400 text-white p-4"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    )
}

export default Profile;