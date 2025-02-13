import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 헤더 */}
            <Header />

            {/* 동적 컨텐츠 영역 */}
            <main className="flex-grow p-4">
                <Outlet />
            </main>

            {/* 푸터 */}
            <Footer />
        </div>
    );
};

export default Layout;
