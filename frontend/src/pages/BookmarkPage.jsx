import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark } from "react-icons/fa"; // ✅ 북마크 아이콘 추가

// 📝 **데모 데이터 (API 연결 전까지 사용)**
const mockBookmarkedPosts = [
    { id: 1, title: "편의점 조합 추천", writer: "user1", profile_img: "https://source.unsplash.com/40x40/?face", date: "2025/01/03", update_date: "2025/01/05", thumbnail: "https://source.unsplash.com/80x80/?food" },
    { id: 2, title: "서브웨이 꿀조합", writer: "user2", profile_img: "https://source.unsplash.com/40x40/?avatar", date: "2025/01/08", update_date: null, thumbnail: null },
    { id: 3, title: "CU 신상 먹어봤음", writer: "user3", profile_img: "https://source.unsplash.com/40x40/?portrait", date: "2025/01/10", update_date: "2025/01/12", thumbnail: "https://source.unsplash.com/80x80/?drink" },
    { id: 4, title: "세븐일레븐 신제품 분석", writer: "user4", profile_img: "https://source.unsplash.com/40x40/?headshot", date: "2025/01/15", update_date: null, thumbnail: null },
];

const BookmarkPage = () => {
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState("latest"); // ✅ 기본 정렬 최신순

    // ✅ 정렬 기능 (최신순, 오래된순)
    const sortedPosts = [...mockBookmarkedPosts].sort((a, b) => {
        if (sortOption === "latest") return new Date(b.date) - new Date(a.date); // 최신순
        if (sortOption === "oldest") return new Date(a.date) - new Date(b.date); // 오래된순
        return 0;
    });

    return (
        <div className="p-4 max-w-lg mx-auto space-y-6">
            {/* 🔹 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-center">북마크한 글 📌</h2>
                <button onClick={() => navigate("/")} className="text-gray-500 text-sm">
                    ← 홈으로
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
                    <option value="oldest">오래된순</option>
                </select>
            </div>

            {/* 🔹 북마크한 글 목록 */}
            <div>
                {sortedPosts.length > 0 ? (
                    <ul className="space-y-3">
                        {sortedPosts.map((post) => (
                            <li
                                key={post.id}
                                className="p-3 border rounded-lg flex items-center justify-between transition hover:shadow-md cursor-pointer"
                                onClick={() => navigate(`/posts/${post.id}`)} // ✅ 즉시 이동
                            >
                                {/* 🔹 썸네일 (이미지가 있을 때만 표시) */}
                                {post.thumbnail && (
                                    <div className="w-14 h-14 flex-shrink-0">
                                        <img src={post.thumbnail} alt="thumbnail" className="w-full h-full object-cover rounded-md" />
                                    </div>
                                )}

                                {/* 🔹 글 정보 */}
                                <div className="flex-1 ml-3">
                                    <p className="block text-gray-800 font-bold mt-1 text-sm">
                                        {post.title.length > 15 ? post.title.slice(0, 15) + "..." : post.title}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        {/* 🔹 작성자 프로필 이미지 */}
                                        <img src={post.profile_img} alt="Profile" className="w-5 h-5 rounded-full" />
                                        <p className="text-gray-600 text-xs">{post.writer}</p>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {post.date} {post.update_date && ` (수정:${post.update_date})`}
                                    </p>
                                </div>

                                {/* 🔹 북마크 아이콘 */}
                                <div className="text-gray-500 text-sm">
                                    <FaBookmark className="text-yellow-500" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center">북마크한 게시글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default BookmarkPage;
