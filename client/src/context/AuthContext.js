import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const { data } = await getMe();
                // Backend returns { user: {...} }
                setUser(data.user || data);
            } catch (error) {
                console.error("Failed to fetch user", error);
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        toast.success("🔌 Disconnected from NexusAI");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

