import React from "react";
import { useParams } from "react-router-dom";

const BrandPage = () => {
    const { brandName } = useParams();

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-center text-xl font-bold my-4">{brandName} 게시판</h2>
            <p className="text-gray-600 text-center">해당 브랜드의 게시글을 불러오는 자리입니다.</p>
        </div>
    );
};

export default BrandPage;
