import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaStar, FaUserCircle, FaSearch } from "react-icons/fa";

const brands = ["GS25", "CU", "세븐일레븐", "이마트24", "서브웨이", "기타"];

// 📝 **데모 데이터**
const mockPosts = {
    GS25: [
        { id: 1, title: "GS25 최고의 조합은 정말 대박이에요", writer: "writer1", profile_img: "https://source.unsplash.com/40x40/?person", date: "2025/01/03", update_date: "2025/01/05", likes: 5, rating: 4.5, thumbnail: "https://source.unsplash.com/80x80/?food" },
        { id: 2, title: "GS25 신상 조합 대박", writer: "writer2", profile_img: null, date: "2025/01/02", update_date: null, likes: 300, rating: 4.2, thumbnail: null },
    ],
    CU: [
        { id: 3, title: "CU 핫한 조합 지금 난리 났어요", writer: "writer3", profile_img: "https://source.unsplash.com/40x40/?avatar", date: "2025/01/01", update_date: "2025/01/05", likes: 7, rating: 5.0, thumbnail: "https://source.unsplash.com/80x80/?drink" },
    ],
    "세븐일레븐": [
        { id: 5, title: "세븐일레븐 컵라면 레시피 공개", writer: "writer5", profile_img: "https://source.unsplash.com/40x40/?face", date: "2025/01/03", update_date: "2025/01/07", likes: 45, rating: 5.0, thumbnail: "https://source.unsplash.com/80x80/?snack" },
    ],
    "이마트24": [],
    "서브웨이": [
        { id: 7, title: "서브웨이 우즈정식", writer: "writer7", profile_img: "https://source.unsplash.com/40x40/?portrait", date: "2025/01/03", update_date: "2025/01/07", likes: 45, rating: 5.0, thumbnail: "https://source.unsplash.com/80x80/?sandwich" },
    ],
    기타: [],
};

const BrandBoardPage = () => {
    const { brand } = useParams();
    const navigate = useNavigate();

    const [selectedBrand, setSelectedBrand] = useState(brand || "GS25");
    const [sortOption, setSortOption] = useState("latest");
    const [searchQuery, setSearchQuery] = useState(""); // ✅ 검색어 상태 추가

    useEffect(() => {
        if (brand && brand !== selectedBrand) {
            setSelectedBrand(brand);
        }
    }, [brand]);

    const handleBrandChange = (newBrand) => {
        if (selectedBrand !== newBrand) {
            setSelectedBrand(newBrand);
            navigate(`/brands/${newBrand}`, { replace: true });
        }
    };

    // ✅ 검색 및 정렬 적용
    const sortedAndFilteredPosts = [...(mockPosts[selectedBrand] || [])]
        .filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase())) // ✅ 검색 적용
        .sort((a, b) => {
            if (sortOption === "latest") return new Date(b.date) - new Date(a.date);
            if (sortOption === "likes") return b.likes - a.likes;
            if (sortOption === "rating") return b.rating - a.rating;
            return 0;
        });

    return (
        <div className="p-4 max-w-lg mx-auto space-y-6">
            {/* 🔹 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">브랜드 게시판 📌</h2>
                <button onClick={() => navigate("/")} className="text-gray-500 text-sm">← 홈으로</button>
            </div>

            {/* 🔹 브랜드 선택 리스트 */}
            <div className="flex space-x-3 overflow-x-auto pb-3 border-b">
                {brands.map((b) => (
                    <button
                        key={b}
                        onClick={() => handleBrandChange(b)}
                        className={`px-2 py-1 text-sm rounded-md transition ${selectedBrand === b ? "text-green-700 font-bold border-b-2 border-green-700" : "text-gray-500"}`}
                    >
                        {b}
                    </button>
                ))}
            </div>

            {/* 🔹 검색창 & 정렬 옵션 */}
            <div className="flex justify-between items-center">
                {/* 🔍 검색 입력 필드 */}
                <div className="relative flex-1 mr-2">
                    <input
                        type="text"
                        placeholder="게시글 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border px-3 py-1 w-full rounded-md pl-8"
                    />

                </div>

                {/* 정렬 옵션 */}
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="border px-3 py-1 rounded-md">
                    <option value="latest">최신순</option>
                    <option value="likes">좋아요순</option>
                    <option value="rating">평점순</option>
                </select>
            </div>

            {/* 🔹 게시글 목록 */}
            <div>
                {sortedAndFilteredPosts.length > 0 ? (
                    <ul className="space-y-3">
                        {sortedAndFilteredPosts.map((post) => (
                            <li key={post.id} className="p-3 border rounded-lg flex items-center hover:shadow-md transition-all">
                                {/* 🔹 썸네일 (없으면 안 보이게) */}
                                {post.thumbnail && (
                                    <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden">
                                        <img src={post.thumbnail} alt="썸네일" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                {/* 🔹 게시글 정보 */}
                                <div className="flex-1 px-3 min-w-[200px]">
                                    <button onClick={() => navigate(`/posts/${post.id}`)} className="text-gray-800 font-bold block truncate">
                                        {post.title.length > 15 ? post.title.slice(0, 15) + "..." : post.title}
                                    </button>
                                    <div className="flex items-center mt-1 space-x-2">
                                        {/* 🔹 작성자 프로필 이미지 (없으면 기본 아이콘) */}
                                        {post.profile_img ? (
                                            <img src={post.profile_img} alt="프로필" className="w-6 h-6 rounded-full" />
                                        ) : (
                                            <FaUserCircle className="text-gray-400 w-6 h-6" />
                                        )}
                                        <p className="text-gray-500 text-xs">{post.writer}</p>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {post.date} {post.update_date && `(수정:${post.update_date})`}
                                    </p>
                                </div>

                                {/* 🔹 좋아요 & 별점 (일정한 위치 유지) */}
                                <div className="flex flex-col items-end min-w-[70px] text-sm space-y-1">
                                    <div className="flex items-center text-yellow-500 space-x-1 w-full justify-end">
                                        <FaStar /> <span className="w-6 text-right text-gray-500">{post.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center text-red-500 space-x-1 w-full justify-end">
                                        <FaHeart /> <span className="w-6 text-right text-gray-500">{post.likes}</span>
                                    </div>
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

export default BrandBoardPage;
