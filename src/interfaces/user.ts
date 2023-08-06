export interface ISignupUser {
    email: string;
    password: string;
    username: string;
}

export interface ILoginUser {
    email: string;
    password: string;
}

export interface IRegisteredUser {
    _id: string;
    email: string;
    username: string;
    isAdmin: boolean;
    isVerified: boolean;
}