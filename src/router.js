import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SecurityUtils } from "./utils/Security";

import Homepage from "./Pages/Homepage";
import StudentpreneurAward from "./Pages/StudentpreneurAward";
import RegistrationPage from "./Pages/RegistrationPage";
import LoginPage from "./Pages/LoginPage";
import DashboardPage from "./Pages/DashboardPage";
import Preloader from "./Component/Preloader";
import ScrollToTop from "./Component/ScrollToTop";
import AOS from "aos";
import "aos/dist/aos.css";

// ✅ Common layout
import Navbar from "./Pages/Navbar";
import Footer from "./Pages/Footer";
import CustomCursor from "./Component/Cursor";

gsap.registerPlugin(ScrollTrigger);

// 🔥 Layout wrapper
const Layout = ({ children }) => {
    return (
        <>
            <CustomCursor />
            <Navbar />
            {children}
            <Footer />
        </>
    );
};

const Router = () => {
    const [loading, setLoading] = useState(true);

    // AOS init
    useEffect(() => {
        AOS.init({ duration: 1000, once: false, easing: "ease-in-out" });
    }, []);

    // Prevent scroll restore
    // 🔥 1. Prevent browser scroll restoration (VERY IMPORTANT)
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    // 🔥 2. Reset scroll position and clear system on enter
    useEffect(() => {
        window.scrollTo(0, 0);

        // ✅ Page Enter Clear Logic
        const initSecurity = async () => {
            try {
                await SecurityUtils.clearAppCache();
            } catch (e) {
                console.clear();
                console.error("Router: Security initialization failed", e);
            }
        };
        initSecurity();
    }, []);

    // 🔥 3. Preloader + FINAL ScrollTrigger refresh fix
    useEffect(() => {
        document.body.style.overflow = "hidden";

        const timer = setTimeout(() => {
            setLoading(false);
            document.body.style.overflow = "auto";

            // ✅ FORCE layout calculation
            document.body.getBoundingClientRect();

            // ✅ Refresh ScrollTrigger shortly after Homepage mounts
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 600); // Wait for initial mount and first Lottie frames

            // ✅ Second pass for slower assets
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 2000);

        }, 2000);


        return () => clearTimeout(timer);
    }, []);

    // 🔥 4. Global GSAP stability settings
    useEffect(() => {
        gsap.config({
            autoSleep: 60,
            force3D: true,
        });

        ScrollTrigger.config({
            ignoreMobileResize: true,
        });

        ScrollTrigger.defaults({
            anticipatePin: 1,
        });
    }, []);

    if (loading) {
        return <Preloader />;
    }

    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* ✅ Homepage */}
                <Route
                    path="/"
                    element={
                        <Layout>
                            <Homepage />
                        </Layout>
                    }
                />

                {/* ✅ New Route */}
                <Route
                    path="/studentpreneur-award"
                    element={
                        <Layout>
                            <StudentpreneurAward />
                        </Layout>
                    }
                />
                {/* ✅ New Route */}
                <Route
                    path="/register"
                    element={
                        <Layout>
                            <RegistrationPage />
                        </Layout>
                    }
                />
                {/* ✅ New Route */}
                <Route
                    path="/login"
                    element={
                        <Layout>
                            <LoginPage />
                        </Layout>
                    }
                />
                {/* ✅ New Route */}
                <Route
                    path="/dashboard"
                    element={
                        <Layout>
                            <DashboardPage />
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;