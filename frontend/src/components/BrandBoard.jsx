import React, { useState, useEffect } from "react";
import BrandCard from "./PostCard";
import BrandList from "./BrandList";

const dummyPosts = [
    {
        id: 1,
        brand: "GS25",
        title: "새우버거의 참맛",
        writer: "writer name",
        date: "2025/01/03",
        image: null, // 이미지가 없을 경우
        rating: 4.2,
        likes: 10,
    },
    {
        id: 2,
        brand: "CU",
        title: "초코칩 쿠키 대박!",
        writer: "user123",
        date: "2025/02/10",
        image: "https://via.placeholder.com/50",
        rating: 3.8,
        likes: 7,
    },
];

const BrandBoard = ({ selectedBrand }) => {
    const filteredPosts = dummyPosts.filter((post) => post.brand === selectedBrand);

    return (
        <div className="container mx-auto p-4">
            {filteredPosts.length === 0 ? (
                <p className="text-center text-gray-500">게시글이 없습니다.</p>
            ) : (
                filteredPosts.map((post) => (
                    <div key={post.id} className="flex items-center border p-3 mb-3 rounded-lg shadow-sm">
                        {post.image && (
                            <img src={post.image} alt="썸네일" className="w-16 h-16 rounded-md mr-4 object-cover" />
                        )}
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{post.title}</h3>
                            <p className="text-sm text-gray-500">{post.writer} | {post.date}</p>
                            <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                                <span>⭐ {post.rating.toFixed(1)}</span>
                                <span>❤️ {post.likes}</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default BrandBoard;
