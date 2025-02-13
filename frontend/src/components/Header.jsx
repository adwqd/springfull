import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className=" text-black p-4 relative">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">맛있조합</h1>

                {/* 햄버거 메뉴 */}
                <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* 네비게이션 바 */}
                <nav className={`absolute top-full left-0 w-full bg-[#ffffff] transition-all duration-300 ease-in-out 
                        ${isOpen ? "block" : "hidden"} lg:block lg:static lg:w-auto`}>
                    <ul className="flex flex-col lg:flex-row lg:space-x-6 p-4 lg:p-0">
                        <li><a href="#" className="block p-2 hover:bg-white-700 rounded">홈</a></li>
                        <li><a href="#" className="block p-2 hover:bg-white-700 rounded">브랜드 게시판</a></li>
                        <li><a href="#" className="block p-2 hover:bg-white-700 rounded">카테고리 랭킹 게시판</a></li>
                        <li><a href="#" className="block p-2 hover:bg-white-700 rounded">급상승 랭킹 게시판</a></li>
                        <li><a href="#" className="block p-2 hover:bg-white-700 rounded">검색창</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
