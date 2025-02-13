import React from "react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import CategoryPage from "./CategoryPage";

const categories = ["편의점", "서브웨이", "기타", "콜라보"];

const CategoryRankingPage = () => {
    const { category } = useParams();

    if (!category) {
        return <Navigate to="/categoryRanking/편의점" replace />;
    }

    return (
        <div className="p-4 max-w-md mx-auto space-y-6">
            <h2 className="text-lg font-bold mb-3">카테고리 랭킹 🏆</h2>
            <div className="bg-gray-100 p-4 rounded-sm space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    {categories.map((c) => (
                        <Link
                            key={c}
                            to={`/categoryRanking/${c}`}
                            className={`py-2 text-center rounded-lg text-sm ${category === c ? "bg-green-700 text-white" : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {c}
                        </Link>
                    ))}
                </div>
            </div>

            {/* 카테고리 페이지 렌더링 */}
            <Routes>
                <Route path=":category" element={<CategoryPage />} />
            </Routes>
        </div>
    );
};

export default CategoryRankingPage;
