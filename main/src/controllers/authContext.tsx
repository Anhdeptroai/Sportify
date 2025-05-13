import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { User } from '../models/user';

export type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType>(null!);

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

const AuthContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        let userId = localStorage.getItem('user_id');
        if (!userId && token) {
            const payload = parseJwt(token);
            if (payload && payload.user_id) {
                userId = payload.user_id;
                localStorage.setItem('user_id', String(userId));
            }
        }
        if (token && userId) {
            axios.get(`http://13.215.205.59:8000/api/users/${userId}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => {
                setUser({
                    ...response.data,
                    id: response.data.id ?? Number(userId)
                });
                setIsAuthenticated(true);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await axios.post('http://13.215.205.59:8000/api/token/', {
                email,
                password
            });
            const { access, user_id } = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('user_id', String(user_id));
            const userResponse = await axios.get(`http://13.215.205.59:8000/api/users/${user_id}/`, {
                headers: { 'Authorization': `Bearer ${access}` }
            });
            setUser({
                ...userResponse.data,
                id: userResponse.data.id ?? Number(user_id)
            });
            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
    };

    const contextValue: AuthContextType = {
        user,
        login,
        logout,
        isAuthenticated,
        loading
    };

    useEffect(() => {
        console.log('AuthContext: Current user:', user);
    }, [user]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider; 