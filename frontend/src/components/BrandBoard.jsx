import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import BrandPage from "./BrandPage";

const BrandBoardPage = () => {
    const location = useLocation();
    const [currentBrand, setCurrentBrand] = useState(null);

    // ✅ 경로 변경 감지하여 브랜드 업데이트
    useEffect(() => {
        const brand = decodeURIComponent(location.pathname.split("/")[2] || "");
        if (brand !== currentBrand) {
            setCurrentBrand(brand);
        }
    }, [location.pathname, currentBrand]);

    return (
        <Routes>
            {/* ✅ key 값을 동적으로 설정하여 브랜드 변경 시 리렌더링 유도 */}
            <Route path="/:brand" element={<BrandPage key={currentBrand} />} />
        </Routes>
    );
};

export default BrandBoardPage;
