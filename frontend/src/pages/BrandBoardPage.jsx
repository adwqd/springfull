import React from "react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import BrandPage from "./BrandPage";

const brands = ["GS25", "CU", "세븐일레븐", "이마트24", "서브웨이", "기타"];

const BrandBoardPage = () => {
    const { brand } = useParams();

    if (!brand) {
        return <Navigate to="/brandBoard/GS25" replace />;
    }

    return (
        <div className="p-4 max-w-md mx-auto space-y-6">
            <h2 className="text-lg font-bold mb-3">브랜드 게시판 📌</h2>
            <div className="bg-gray-100 p-4 rounded-sm space-y-2">
                <div className="grid grid-cols-3 gap-2">
                    {brands.map((b) => (
                        <Link
                            key={b}
                            to={`/brandBoard/${b}`}
                            className={`py-2 text-center rounded-lg text-sm ${brand === b ? "bg-green-700 text-white" : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {b}
                        </Link>
                    ))}
                </div>
            </div>

            {/* 브랜드 페이지 렌더링 */}
            <Routes>
                <Route path=":brand" element={<BrandPage />} />
            </Routes>
        </div>
    );
};

export default BrandBoardPage;
