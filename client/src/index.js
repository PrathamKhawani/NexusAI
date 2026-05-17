import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Global request interceptor to rewrite hardcoded local endpoints in production
axios.interceptors.request.use((config) => {
    let apiBase = process.env.REACT_APP_API_URL;
    if (apiBase && config.url) {
        if (apiBase.endsWith('/')) apiBase = apiBase.slice(0, -1);
        
        if (config.url.startsWith("http://localhost:5000/api")) {
            config.url = config.url.replace("http://localhost:5000/api", apiBase);
        } else if (config.url.startsWith("http://localhost:5000")) {
            config.url = config.url.replace("http://localhost:5000", apiBase.replace("/api", ""));
        }
    }
    return config;
}, (error) => Promise.reject(error));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
