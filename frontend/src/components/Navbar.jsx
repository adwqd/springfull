import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const brands = [
    { id: "0", name: "기타" },
    { id: "1", name: "GS25" },
    { id: "2", name: "CU" },
    { id: "3", name: "세븐일레븐" },
    { id: "4", name: "이마트24" },
    { id: "5", name: "서브웨이" },
    { id: "6", name: "콜라보" },
];

const categories = [
    { id: "0", name: "기타" },
    { id: "1", name: "편의점" },
    { id: "2", name: "서브웨이" },
];

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { category } = useParams();

    // 초기 상태는 모두 닫힘(false)
    const [navOpen, setNavOpen] = useState(false);
    const [brandMenuOpen, setBrandMenuOpen] = useState(false);
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(category || null);
    const [currentBrand, setCurrentBrand] = useState(null);

    useEffect(() => {
        if (location.pathname.startsWith("/category/")) {
            setCurrentCategory(decodeURIComponent(location.pathname.split("/")[2]));
            setCategoryMenuOpen(true);
        } else {
            setCurrentCategory(null);
            setCategoryMenuOpen(false);
        }

        if (location.pathname.startsWith("/brands/")) {
            const brandId = location.pathname.split("/")[2];
            setCurrentBrand(brandId);
            setBrandMenuOpen(true);
        } else {
            setCurrentBrand(null);
            setBrandMenuOpen(false);
        }
    }, [location.pathname]);

    const closeNav = () => {
        setNavOpen(false);
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
        setCurrentCategory(categoryId);
        closeNav();
    };

    const handleBrandClick = (brandId) => {
        navigate(`/brands/${brandId}`);
        setCurrentBrand(brandId);
        closeNav();
    };

    return (
        <div className="mb-16 flex flex-col lg:flex-row">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-col bg-gray-100 w-60 xl:w-72 h-screen fixed top-0 left-0 shadow-md overflow-y-auto lg:text-lg">
                <div className="p-6">
                    <h1 className="text-green-700 font-bold text-xl mb-6">맛있조합</h1>
                    <ul className="space-y-6">
                        <NavItem to="/" label="🏠 홈" currentPath={location.pathname} onClick={closeNav} />
                        <NavItem to="/posts/new" label="✏️ 글 작성" currentPath={location.pathname} onClick={closeNav} />
                        <NavItem to="/search/detail" label="🔍 검색" currentPath={location.pathname} onClick={closeNav} />

                        {/* Brand Dropdown */}
                        <DropdownMenu
                            label="📌 브랜드 게시판"
                            isOpen={brandMenuOpen}
                            setOpen={setBrandMenuOpen}
                            items={brands}
                            handleClick={handleBrandClick}
                            activeItem={currentBrand}
                        />

                        {/* Category Dropdown */}
                        <DropdownMenu
                            label="🏆 카테고리 랭킹"
                            isOpen={categoryMenuOpen}
                            setOpen={setCategoryMenuOpen}
                            items={categories}
                            handleClick={handleCategoryClick}
                            isCategory
                            activeItem={currentCategory}
                        />

                        <NavItem to="/hotRanking" label="📈 급상승 랭킹" currentPath={location.pathname} onClick={closeNav} />
                        <NavItem to="/users/me" label="👩 마이페이지" currentPath={location.pathname} onClick={closeNav} />
                    </ul>
                </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="lg:hidden bg-white shadow-md fixed top-0 w-full z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link to="/" className="text-green-700 font-bold text-lg" onClick={closeNav}>
                        맛있조합
                    </Link>
                    <button onClick={() => setNavOpen(!navOpen)} className="text-gray-700 font-semibold text-lg">
                        ☰ 메뉴
                    </button>
                </div>

                {navOpen && (
                    <div className="absolute right-0 top-12 bg-gray-100 w-56 h-auto shadow-lg rounded-md p-4">
                        <ul className="space-y-3">
                            <NavItem to="/" label="🏠 홈" currentPath={location.pathname} onClick={closeNav} />
                            <NavItem to="/posts/new" label="✏️ 글 작성" currentPath={location.pathname} onClick={closeNav} />
                            <NavItem to="/search/detail" label="🔍 검색" currentPath={location.pathname} onClick={closeNav} />

                            {/* Brand Dropdown */}
                            <DropdownMenu
                                label="📌 브랜드 게시판"
                                isOpen={brandMenuOpen}
                                setOpen={setBrandMenuOpen}
                                items={brands}
                                handleClick={handleBrandClick}
                                activeItem={currentBrand}
                            />

                            {/* Category Dropdown */}
                            <DropdownMenu
                                label="🏆 카테고리 랭킹"
                                isOpen={categoryMenuOpen}
                                setOpen={setCategoryMenuOpen}
                                items={categories}
                                handleClick={handleCategoryClick}
                                isCategory
                                activeItem={currentCategory}
                            />

                            <NavItem to="/hotRanking" label="📈 급상승 랭킹" currentPath={location.pathname} onClick={closeNav} />
                            <NavItem to="/users/me" label="👩 마이페이지" currentPath={location.pathname} onClick={closeNav} />
                        </ul>
                    </div>
                )}
            </nav>
        </div>
    );
};

// NavItem Component
const NavItem = ({ to, label, currentPath, onClick }) => (
    <li>
        <Link
            to={to}
            className={`block px-4 py-2 rounded-md transition-colors duration-200 ${currentPath === to
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-200 hover:text-green-700"
                }`}
            onClick={onClick}
        >
            {label}
        </Link>
    </li>
);

// DropdownMenu Component
const DropdownMenu = ({ label, isOpen, setOpen, items, handleClick, isCategory, activeItem }) => (
    <li>
        <button
            onClick={() => setOpen(!isOpen)}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-green-700 font-semibold transition-colors duration-200"
        >
            {label}
        </button>
        {isOpen && (
            <ul className="pl-6 mt-1 space-y-2">
                {items.map((item) => {
                    const itemId = item.id;
                    const isActive = activeItem === itemId;
                    return (
                        <li key={itemId}>
                            <button
                                onClick={() => handleClick(itemId)}
                                className={`block px-4 py-2 rounded-md transition-colors duration-200 w-full text-left ${isActive
                                    ? "bg-green-600 text-white"
                                    : "text-gray-700 hover:bg-gray-200 hover:text-green-700"
                                    }`}
                            >
                                {isCategory ? item.name : item.name}
                            </button>
                        </li>
                    );
                })}
            </ul>
        )}
    </li>
);

export default Navbar;