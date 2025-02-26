import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaStar, FaUserCircle, FaArrowLeft } from "react-icons/fa";

// 더미 데이터 (게시글 목록)
const dummyPosts = [
    { id: 1, title: "미식만두랑 잘어울리는 라면", date: "2025/01/03", update_date: "2025/01/05", price: "3200원", user: "user1", brand: "GS25", likes: 25, rating: 4.3, thumbnail: null },
    { id: 2, title: "우유 말먹하는 초코과자", date: "2025/01/03", update_date: "2025/01/05", price: "2300원", user: "user2", brand: "CU", likes: 14, rating: 4.7, thumbnail: "https://source.unsplash.com/80x80/?snack" },
    { id: 3, title: "요즘 유행하는 서브웨이 조합", date: "2025/01/03", update_date: "2025/01/05", price: "3200원", user: "user3", brand: "서브웨이", likes: 50, rating: 4.9, thumbnail: "https://source.unsplash.com/80x80/?sandwich" },
    { id: 4, title: "엽떡에 어울리는 토핑 추천", date: "2025/01/03", update_date: "2025/01/05", price: "5000원", user: "user4", brand: "세븐일레븐", likes: 8, rating: 4.1, thumbnail: "https://source.unsplash.com/80x80/?spicy" },
    { id: 5, title: "이마트에서만 파는 간식!", date: "2025/01/03", update_date: "2025/01/05", price: "1500원", user: "user5", brand: "이마트24", likes: 35, rating: 4.5, thumbnail: null }
];

const AllPostsPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [sortOption, setSortOption] = useState("latest");
    const [searchQuery, setSearchQuery] = useState("");

    // 🚀 1. 게시글 데이터 가져오기 (API 연결 가능)
    useEffect(() => {
        setPosts(dummyPosts);
    }, []);

    // 🚀 2. 검색 & 정렬 적용
    const sortedAndFilteredPosts = [...posts]
        .filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase())) // 검색 적용
        .sort((a, b) => {
            if (sortOption === "latest") return b.id - a.id;
            if (sortOption === "likes") return b.likes - a.likes;
            if (sortOption === "rating") return b.rating - a.rating;
            return 0;
        });

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-6">
            {/* 🔹 헤더 & 뒤로 가기 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-center">전체 게시판 📁</h2>
                <button onClick={() => navigate(-1)} className="text-gray-500 text-sm flex items-center">
                    <FaArrowLeft className="mr-1" /> 뒤로 가기
                </button>
            </div>

            {/* 🔹 검색 & 정렬 */}
            <div className="flex justify-between items-center">
                {/* 🔍 검색 입력 필드 */}
                <div className="relative flex-1 mr-2">
                    <input
                        type="text"
                        placeholder="게시글 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border px-3 py-1 w-full rounded-md pl-2"
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
                                        {/* 🔹 작성자 정보 */}
                                        <FaUserCircle className="text-gray-400 w-4 h-4" />
                                        <p className="text-gray-500 text-xs">{post.user}</p>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {post.date} {post.update_date && `(수정:${post.update_date})`}
                                    </p>
                                </div>

                                {/* 🔹 좋아요 & 평점 */}
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

export default AllPostsPage;
