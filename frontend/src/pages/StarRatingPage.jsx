import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft } from "react-icons/fa"; // ✅ 리액트 아이콘 추가

// 📝 **데모 데이터 (API 연결 전까지 사용)**
const mockRatedPosts = [
    { id: 1, title: "편의점 조합 리뷰", writer: "user1", profile_img: "https://source.unsplash.com/40x40/?face", date: "2025/01/03", update_date: "2025/01/05", myRating: 4.5, avgRating: 4.2, thumbnail: "https://source.unsplash.com/80x80/?food" },
    { id: 2, title: "서브웨이 리뷰", writer: "user2", profile_img: "https://source.unsplash.com/40x40/?avatar", date: "2025/01/08", update_date: null, myRating: 4.0, avgRating: 3.8, thumbnail: null },
    { id: 3, title: "CU 신상 리뷰", writer: "user3", profile_img: "https://source.unsplash.com/40x40/?portrait", date: "2025/01/10", update_date: "2025/01/12", myRating: 5.0, avgRating: 4.8, thumbnail: "https://source.unsplash.com/80x80/?drink" },
    { id: 4, title: "세븐일레븐 신제품", writer: "user4", profile_img: "https://source.unsplash.com/40x40/?headshot", date: "2025/01/15", update_date: null, myRating: 3.5, avgRating: 3.9, thumbnail: null },
];

const MyRatedPostsPage = () => {
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState("latest"); // ✅ 기본 정렬 최신순

    // ✅ 정렬 기능 (최신순, 내가 준 별점순, 평균 별점순)
    const sortedPosts = [...mockRatedPosts].sort((a, b) => {
        if (sortOption === "latest") return new Date(b.date) - new Date(a.date); // 최신순
        if (sortOption === "myRating") return b.myRating - a.myRating; // 내가 준 별점순
        if (sortOption === "avgRating") return b.avgRating - a.avgRating; // 평균 별점순
        return 0;
    });

    return (
        <div className="p-4 max-w-lg mx-auto space-y-6">
            {/* 🔹 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-center">별점 준 글⭐</h2>
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
                    <option value="myRating">내가 준 별점순</option>
                    <option value="avgRating">평균 별점순</option>
                </select>
            </div>

            {/* 🔹 아이콘 설명 (가로 정렬 & 여백 최소화) */}
            <div className="border-t pt-4 text-gray-600 text-xs flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                    <FaStar className="text-blue-500" />
                    <span>내가 준 별점</span>
                </div>
                <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-500" />
                    <span>평균 별점</span>
                </div>
            </div>

            {/* 🔹 내가 매긴 별점 목록 */}
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
                                        <img src={post.profile_img} alt="Profile" className="w-4 h-4 rounded-full" />
                                        <p className="text-gray-600 text-xs">{post.writer}</p>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {post.date} {post.update_date && ` (수정:${post.update_date})`}
                                    </p>
                                </div>

                                {/* 🔹 별점 */}
                                <div className="text-gray-500 text-sm flex flex-col items-end space-y-1">
                                    <div className="flex items-center space-x-1">
                                        <FaStar className="text-blue-500" />
                                        <span className="font-medium">{post.myRating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <FaStar className="text-yellow-500" />
                                        <span className="font-medium">{post.avgRating.toFixed(1)}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center">별점을 매긴 게시글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default MyRatedPostsPage;
