import React from "react";

const BrandList = ({ selectedBrand, onSelect }) => {
    // 브랜드 목록을 BrandList 내부에 정의
    const brands = ["GS25", "CU", "세븐일레븐", "이마트24", "기타", "콜라보"];

    return (
        <div className="flex space-x-4 justify-center my-4">
            {brands.map((brand) => (
                <button
                    key={brand}
                    className={`px-4 py-2 text-sm font-medium ${selectedBrand === brand ? "text-green-600 font-bold underline" : "text-gray-500"
                        }`}
                    onClick={() => onSelect(brand)}
                >
                    {brand}
                </button>
            ))}
        </div>
    );
};

export default BrandList;
