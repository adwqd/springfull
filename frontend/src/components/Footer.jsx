import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";

const Footer = () => {
    const location = useLocation();

    // 현재 경로가 활성화된 경우 강조 스타일 적용
    const isActive = (path) => location.pathname === path ? "text-green-700" : "text-gray-500";

    return (
        <>
            <div className="pb-20"></div>
            <footer className="bg-gray-100 fixed bottom-0 w-full p-2 md:hidden shadow-lg">
                <nav className="flex justify-around">
                    <Link to="/" className={`flex flex-col items-center ${isActive("/")}`}>
                        <Home size={24} />
                        <span className="mt-1 text-xs">홈</span>
                    </Link>
                    <Link to="/search/detail" className={`flex flex-col items-center ${isActive("/search/detail")}`}>
                        <Search size={24} />
                        <span className="mt-1 text-xs">검색</span>
                    </Link>
                    <Link to="/posts/new" className={`flex flex-col items-center ${isActive("/posts/new")}`}>
                        <PlusCircle size={24} />
                        <span className="mt-1 text-xs">글작성</span>
                    </Link>
                    <Link to="/chatbot" className={`flex flex-col items-center ${isActive("/chatbot")}`}>
                        <MessageCircle size={24} />
                        <span className="mt-1 text-xs">챗봇</span>
                    </Link>
                    <Link to="/users/me" className={`flex flex-col items-center ${isActive("/users/me")}`}>
                        <User size={24} />
                        <span className="mt-1 text-xs">마이페이지</span>
                    </Link>
                </nav>
            </footer>
        </>
    );
};

export default Footer;
