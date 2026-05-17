import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ── Axios instance with auto token injection ──
const API = axios.create({ baseURL: `${BASE_URL}/users` });

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Auth endpoints ──
export const registerUser = (userData) => API.post("/register", userData);
export const loginUser = (userData) => API.post("/login", userData);
export const getMe = () => API.get("/me");
export const updateProfile = (userData) => API.put("/update", userData);
export const logoutUser = () => API.post("/logout");

// ── Posts (News) endpoints ──
const postsAPI = axios.create({ baseURL: `${BASE_URL}/posts` });
postsAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
export const getPosts = (params) => postsAPI.get("/", { params });
export const getPostById = (id) => postsAPI.get(`/${id}`);
export const createPost = (data) => postsAPI.post("/", data);
export const deletePost = (id) => postsAPI.delete(`/${id}`);

// ── AI Tools endpoints ──
const toolsAPI = axios.create({ baseURL: `${BASE_URL}/tools` });
toolsAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
export const getTools = (params) => toolsAPI.get("/", { params });
export const getToolById = (id) => toolsAPI.get(`/${id}`);
export const createTool = (data) => toolsAPI.post("/", data);
export const upvoteTool = (id) => toolsAPI.put(`/${id}/upvote`);
export const rateTool = (id, data) => toolsAPI.put(`/${id}/rate`, data);

// ── Activity endpoints ──
const activityAPI = axios.create({ baseURL: `${BASE_URL}/activity` });
activityAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
export const getMyActivity = (params) => activityAPI.get("/me", { params });
export const getActivityStats = () => activityAPI.get("/stats");
export const logActivity = (data) => activityAPI.post("/", data);

// ── Bookmarks endpoints ──
const bookmarksAPI = axios.create({ baseURL: `${BASE_URL}/bookmarks` });
bookmarksAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
export const getMyBookmarks = (params) => bookmarksAPI.get("/me", { params });
export const checkBookmark = (itemId) => bookmarksAPI.get(`/check/${itemId}`);
export const addBookmark = (data) => bookmarksAPI.post("/", data);
export const removeBookmark = (id) => bookmarksAPI.delete(`/${id}`);

export default API;
