'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const Profile = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios.post('/api/users/logout');
            toast.success('Logged out successfully!');
            router.push('/login');
        } catch (error: any) {
            toast.error('Could not logout!');
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile page</h1>
            <hr />
            <p>Profile</p>
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