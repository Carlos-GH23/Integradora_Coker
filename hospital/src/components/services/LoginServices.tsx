import axios from "axios";
import { UserModel } from "../models/UserModel";

const API_URL = "http://localhost:8080/api/auth/login" //Se cambiara la URL a 

export const login = async (username: string, password: string) => {
    const response = await axios.post(API_URL, {username, password});
    console.log(response.data);
    if(response.status === 200){
        const user: UserModel = response.data.user;
        const formattedUser: UserModel = {
            role: response.data.role,
            name: response.data.name,
            user: response.data.user,
            token: response.data.token
        };
        localStorage.setItem("user", JSON.stringify(formattedUser));
        localStorage.setItem("token",response.data.token);
    }
    window.location.reload();
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "/";
}

export const getUser = (): UserModel | null => {
    const userJSON = localStorage.getItem("user");
    return userJSON ? JSON.parse(userJSON) as UserModel : null;
};

export const isAdmin = (): boolean => {
    const user = getUser();
    return user?.role === "ADMIN";
};

export const isSecretary = (): boolean => {
    const user = getUser();
    return user?.role === "SECRETARY";
};

export const isNurse = (): boolean => {
    const user = getUser();
    return user?.role === "NURSE";
};

export const isLoggedIn = (): boolean => {
    return getUser() !== null;
};