import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/layout/ScrollToTop";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewsFeed from "./pages/NewsFeed";
import AITools from "./pages/AITools";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Layout>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/news" element={<NewsFeed />} />
                        <Route path="/tools" element={<AITools />} />

                        {/* Protected Routes */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/bookmarks" element={<Bookmarks />} />

                        {/* Fallback */}
                        <Route path="*" element={<LandingPage />} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

export default App;
