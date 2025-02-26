import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaStar, FaArrowLeft } from "react-icons/fa"; // ✅ 리액트 아이콘 추가

// 📝 **데모 데이터 (API 연결 전까지 사용)**
const mockMyPosts = [
    { id: 1, title: "편의점 최고의 조합!", brand: "GS25", date: "2025/01/03", update_date: "2025/01/05", likes: 25, rating: 4.7, thumbnail: "https://source.unsplash.com/80x80/?food" },
    { id: 2, title: "서브웨이 꿀조합 공개", brand: "서브웨이", date: "2025/01/08", update_date: null, likes: 11, rating: 4.3, thumbnail: null },
    { id: 3, title: "CU 핫한 신상 조합", brand: "CU", date: "2025/01/10", update_date: "2025/01/12", likes: 30, rating: 5.0, thumbnail: "https://source.unsplash.com/80x80/?snack" },
    { id: 4, title: "세븐일레븐 신상 리뷰", brand: "세븐일레븐", date: "2025/01/15", update_date: null, likes: 5, rating: 3.9, thumbnail: null },
];

const MyPostsPage = () => {
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState("latest"); // ✅ 기본 정렬 최신순

    // ✅ 정렬 기능 (최신순, 좋아요순, 평점순)
    const sortedPosts = [...mockMyPosts].sort((a, b) => {
        if (sortOption === "latest") {
            return new Date(b.date) - new Date(a.date); // 최신순
        } else if (sortOption === "likes") {
            return b.likes - a.likes; // 좋아요순
        } else if (sortOption === "rating") {
            return b.rating - a.rating; // 평점순
        }
        return 0;
    });

    return (
        <div className="p-4 max-w-lg mx-auto space-y-6">
            {/* 🔹 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-center">내가 작성한 글 📝</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                    <FaArrowLeft />
                    <span className="text-sm">뒤로 가기</span>
                </button>
            </div>

            {/* 🔽 정렬 옵션 */}
            <div className="flex justify-end mt-3">
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border px-3 py-1 rounded-md"
                >
                    <option value="latest">최신순</option>
                    <option value="likes">좋아요순</option>
                    <option value="rating">평점순</option>
                </select>
            </div>

            {/* 🔹 게시글 목록 */}
            <div>
                {sortedPosts.length > 0 ? (
                    <ul className="space-y-3">
                        {sortedPosts.map((post) => (
                            <li key={post.id} className="p-3 border rounded-lg flex items-center justify-between transition hover:shadow-md">
                                {/* 🔹 썸네일 (이미지가 있을 때만 표시) */}
                                {post.thumbnail && (
                                    <div className="w-14 h-14 flex-shrink-0">
                                        <img src={post.thumbnail} alt="thumbnail" className="w-full h-full object-cover rounded-md" />
                                    </div>
                                )}

                                {/* 🔹 글 정보 */}
                                <div className="flex-1 ml-3">
                                    <button
                                        onClick={() => navigate(`/posts/${post.id}`)}
                                        className="block text-gray-800 font-bold mt-1 text-sm"
                                    >
                                        {post.title.length > 15 ? post.title.slice(0, 15) + "..." : post.title}
                                    </button>
                                    <p className="text-gray-500 text-xs">브랜드: {post.brand}</p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {post.date} {post.update_date && ` (수정:${post.update_date})`}
                                    </p>
                                </div>

                                {/* 🔹 좋아요 & 평점 */}
                                <div className="text-gray-500 text-sm flex flex-col items-end space-y-1 w-20">
                                    <div className="flex items-center space-x-1 w-full justify-end">
                                        <FaStar className="text-yellow-500" /> <span className="font-medium text-right w-8">{post.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 w-full justify-end">
                                        <FaHeart className="text-red-500" /> <span className="font-medium text-right w-8">{post.likes}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center">작성한 게시글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default MyPostsPage;
