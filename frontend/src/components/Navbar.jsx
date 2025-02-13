import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [navOpen, setNavOpen] = useState(false);
    const [brandMenuOpen, setBrandMenuOpen] = useState(false);
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

    const brands = ["GS25", "CU", "세븐일레븐", "이마트24", "서브웨이", "기타"];
    const categories = ["편의점", "서브웨이", "기타", "콜라보"];

    // 메뉴 닫기 함수
    const closeAllMenus = () => {
        setNavOpen(false);
        setBrandMenuOpen(false);
        setCategoryMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-md fixed top-0 w-full z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* 로고 */}
                <Link to="/" className="text-green-700 font-bold text-xl" onClick={closeAllMenus}>
                    맛있조합
                </Link>

                <div className="flex space-x-3">
                    <Link to="/login" className="bg-yellow-400 px-3 py-1 rounded text-sm">로그인</Link>
                    <button
                        onClick={() => {
                            setNavOpen(!navOpen);
                            setBrandMenuOpen(false);
                            setCategoryMenuOpen(false);
                        }}
                        className="text-gray-700 hover:text-green-600 font-semibold"
                    >
                        ☰ 메뉴
                    </button>
                </div>
            </div>

            {/* 네비바 메뉴 */}
            {navOpen && (
                <div className="absolute left-0 top-12 bg-gray-100 w-48 h-screen shadow-md">
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-gray-700 font-semibold"></span>
                        <button onClick={closeAllMenus} className="text-gray-600 hover:text-red-500 text-lg">
                            ✕
                        </button>
                    </div>
                    <ul className="space-y-4 p-4">
                        <li>
                            <Link to="/" className="text-gray-700 hover:text-green-600 font-semibold" onClick={closeAllMenus}>
                                🏠홈
                            </Link>
                        </li>
                        <li>
                            <Link to="/posts/new" className="text-gray-700 hover:text-green-600 font-semibold" onClick={closeAllMenus}>
                                ✏️글 작성
                            </Link>
                        </li>
                        <li>
                            <Link to="/search/detail" className="text-gray-700 hover:text-green-600 font-semibold" onClick={closeAllMenus}>
                                🔍검색
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    setBrandMenuOpen(!brandMenuOpen);
                                    setCategoryMenuOpen(false);
                                }}
                                className="w-full text-left text-gray-700 hover:text-green-600 font-semibold"
                            >
                                📌브랜드 게시판
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    setCategoryMenuOpen(!categoryMenuOpen);
                                    setBrandMenuOpen(false);
                                }}
                                className="w-full text-left text-gray-700 hover:text-green-600 font-semibold"
                            >
                                🏆카테고리 랭킹
                            </button>
                        </li>
                        <li>
                            <Link to="/hotRanking" className="text-gray-700 hover:text-green-600 font-semibold" onClick={closeAllMenus}>
                                📈급상승 랭킹
                            </Link>
                        </li>
                        <li>
                            <Link to="/users/me" className="text-gray-700 hover:text-green-600 font-semibold" onClick={closeAllMenus}>
                                👩마이페이지
                            </Link>
                        </li>

                    </ul>
                </div>
            )}

            {/* 브랜드 게시판 서브메뉴 */}
            {brandMenuOpen && (
                <div className="absolute left-48 top-12 bg-white w-48 h-screen shadow-md border-l border-gray-300">
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">브랜드 목록</span>
                        <button onClick={() => setBrandMenuOpen(false)} className="text-gray-600 hover:text-red-500 text-lg">
                            ✕
                        </button>
                    </div>
                    <ul className="space-y-4 p-4">
                        {brands.map((brand) => (
                            <li key={brand}>
                                <Link
                                    to={`/brands/${brand}`}
                                    className="block text-gray-700 hover:text-green-600 font-semibold"
                                    onClick={closeAllMenus}
                                >
                                    {brand}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 카테고리 랭킹 서브메뉴 */}
            {categoryMenuOpen && (
                <div className="absolute left-48 top-12 bg-white w-48 h-screen shadow-md border-l border-gray-300">
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">카테고리 목록</span>
                        <button onClick={() => setCategoryMenuOpen(false)} className="text-gray-600 hover:text-red-500 text-lg">
                            ✕
                        </button>
                    </div>
                    <ul className="space-y-4 p-4">
                        {categories.map((category) => (
                            <li key={category}>
                                <Link
                                    to={`/category/${category}`}
                                    className="block text-gray-700 hover:text-green-600 font-semibold"
                                    onClick={closeAllMenus}
                                >
                                    {category}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
