// App.tsx
"use client";

import { Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Layout/navigation";
import { HomePage } from "./pages/HomePage.tsx";
import { LoginPage } from "./pages/Auth/LoginPage.tsx";
import { SignupPage } from "./pages/Auth/SignupPage.tsx";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage.tsx";
import { JournalPage } from "./pages/JournalPage.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import { CommunityPage } from "./pages/CommunityPage.tsx";
import { Toaster } from "sonner";

function App() {
    return (
        <div className="min-h-screen bg-background">
            <Toaster position="bottom-left" richColors />
            <Navigation />
            <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/journal" element={<JournalPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    {/* Optional: Fallback for unknown routes */}
                    <Route path="*" element={<HomePage />} />
            </Routes>
        </div>
    );
}

export default App;