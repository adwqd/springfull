import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const brands = ["GS25", "CU", "세븐일레븐", "이마트24", "서브웨이", "기타"];

// 임시 데이터 (API 연동 예정)
const mockPosts = {
    GS25: [
        { id: 1, title: "GS25 최고의 조합은?", writer: "user1", date: "2025/01/03", likes: 5, rating: 4.5 },
        { id: 2, title: "이거 꼭 먹어보세요!", writer: "user2", date: "2025/01/02", likes: 3, rating: 4.0 },
    ],
    CU: [
        { id: 3, title: "CU에서 핫한 조합", writer: "user3", date: "2025/01/01", likes: 7, rating: 4.8 },
        { id: 4, title: "편의점 음식 리뷰", writer: "user4", date: "2025/01/05", likes: 2, rating: 3.9 },
    ],
    "세븐일레븐": [],
    "이마트24": [],
    "서브웨이": [],
    기타: [],
};

const BrandPage = () => {
    const { brand } = useParams();
    const navigate = useNavigate();
    const [selectedBrand, setSelectedBrand] = useState(brand || "GS25");

    useEffect(() => {
        if (!brands.includes(brand)) {
            navigate("/brands/GS25", { replace: true });
        }
    }, [brand, navigate]);

    const handleBrandChange = (newBrand) => {
        setSelectedBrand(newBrand);
        navigate(`/brands/${newBrand}`, { replace: true });
    };

    return (
        <div className="p-4 max-w-md mx-auto space-y-6">
            <h2 className="text-lg font-bold mb-3">브랜드 게시판 📌</h2>

            {/* 브랜드 선택 버튼 */}
            <div className="bg-gray-100 p-4 rounded-sm">
                <div className="grid grid-cols-3 gap-4">
                    {brands.map((b) => (
                        <Link
                            key={b}
                            to={`/brands/${encodeURIComponent(b)}`} // ✅ URL 변경 시 즉시 반영
                            className={`py-1.5 text-center rounded-md text-[15px] block ${brand === b ? "bg-green-700 text-white" : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {b}
                        </Link>
                    ))}
                </div>
            </div>

            {/* 게시글 목록 */}
            <div>
                <h3 className="text-lg font-bold">{selectedBrand} 게시판</h3>
                {mockPosts[selectedBrand]?.length > 0 ? (
                    <ul className="space-y-3">
                        {mockPosts[selectedBrand].map((post) => (
                            <li key={post.id} className="p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                                <div>
                                    <Link to={`/posts/${post.id}`} className="block text-gray-700 font-bold">
                                        {post.title}
                                    </Link>
                                    <p className="text-gray-600 text-sm">{post.writer}</p>
                                    <p className="text-gray-500 text-xs">{post.date}</p>
                                </div>
                                <div className="text-gray-500 text-sm flex flex-col items-end">
                                    <span>⭐ {post.rating}</span>
                                    <span>❤️ {post.likes}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center">게시글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default BrandPage;
