import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";

const Footer = () => {
    return (
        <>

            <div className="pb-10"></div>

            <footer className="bg-gray-100 fixed bottom-0 w-full h-16 flex justify-around items-center shadow-md md:hidden">
                <nav className="flex justify-around w-full">
                    <Link to="/" className="flex flex-col items-center justify-center space-y-1">
                        <Home size={24} />
                        <span className="text-xs">Home</span>
                    </Link>
                    <Link to="/search/detail" className="flex flex-col items-center justify-center space-y-1">
                        <Search size={24} />
                        <span className="text-xs">검색</span>
                    </Link>
                    <Link to="/posts/new" className="flex flex-col items-center justify-center space-y-1">
                        <PlusCircle size={24} />
                        <span className="text-xs">글작성</span>
                    </Link>
                    <Link to="/chatbot" className="flex flex-col items-center justify-center space-y-1">
                        <MessageCircle size={24} />
                        <span className="text-xs">챗봇</span>
                    </Link>
                    <Link to="/users/me" className="flex flex-col items-center justify-center space-y-1">
                        <User size={24} />
                        <span className="text-xs">마이페이지</span>
                    </Link>
                </nav>
            </footer>
        </>
    );
};

export default Footer;
