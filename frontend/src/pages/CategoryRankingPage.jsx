import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart, FaTrophy, FaUserCircle } from "react-icons/fa";

// 카테고리 목록
const categories = [
    { id: "convenience", name: "편의점" },
    { id: "subway", name: "서브웨이" },
    { id: "others", name: "기타" },
    { id: "collab", name: "콜라보" }, // 자동 등록
];

// 더미 데이터 (API 자리 확보)
const mockData = [
    { id: 1, title: "서브웨이 우즈 정식 레시피", writer: "writer name", date: "2025/01/03", rating: 4.0, likes: 43, image: null, profileImg: "https://source.unsplash.com/40x40/?person", category: ["subway"] },
    { id: 2, title: "GS25 꿀조합", writer: "writer name", date: "2025/01/05", rating: 5.0, likes: 17, image: "https://source.unsplash.com/80x80/?food", profileImg: "https://source.unsplash.com/40x40/?avatar", category: ["convenience"] },
    { id: 3, title: "내가 만든 최고의 레시피", writer: "writer name", date: "2025/01/10", rating: 4.5, likes: 3, image: null, profileImg: null, category: ["subway", "convenience"] },
    { id: 4, title: "이마트24 한정판 조합", writer: "writer name", date: "2025/01/14", rating: 5.0, likes: 1, image: null, profileImg: "https://source.unsplash.com/40x40/?face", category: ["convenience"] },
    { id: 5, title: "서브웨이 & 편의점 콜라보", writer: "writer name", date: "2025/01/03", rating: 4.0, likes: 2, image: "https://source.unsplash.com/80x80/?sandwich", profileImg: null, category: ["subway", "convenience"] },
    { id: 6, title: "이색적인 기타 메뉴", writer: "writer name", date: "2025/01/05", rating: 4.0, likes: 0, image: null, profileImg: "https://source.unsplash.com/40x40/?headshot", category: ["others"] },
];

const CategoryRankingPage = () => {
    const navigate = useNavigate();
    const { category } = useParams();
    const [selectedCategory, setSelectedCategory] = useState(category || "convenience");
    const [rankingData, setRankingData] = useState([]);

    useEffect(() => {
        if (category) setSelectedCategory(category);
    }, [category]);

    useEffect(() => {
        fetchRankingData();
    }, [selectedCategory]);

    const fetchRankingData = async () => {
        try {
            if (selectedCategory === "collab") {
                setRankingData(mockData.filter((post) => post.category.length > 1));
            } else {
                setRankingData(mockData.filter((post) => post.category.includes(selectedCategory)));
            }
        } catch (error) {
            console.error("데이터 불러오기 실패:", error);
        }
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <div className="p-4 max-w-lg mx-auto space-y-6">
            {/* 🔹 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">카테고리 랭킹</h2>
                <button onClick={() => navigate("/")} className="text-gray-500 text-sm">
                    ← 홈으로
                </button>
            </div>

            {/* 🔹 카테고리 선택 리스트 */}
            <div className="flex space-x-3 overflow-x-auto pb-3 border-b">
                {categories.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => handleCategoryClick(c.id)}
                        className={`px-3 py-1 text-sm rounded-md transition ${selectedCategory === c.id ? "text-green-700 font-bold border-b-2 border-green-700" : "text-gray-500"}`}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            {/* 🔹 게시글 목록 */}
            <div>
                {rankingData.length > 0 ? (
                    <ul className="space-y-3">
                        {rankingData.map((post, index) => (
                            <li key={post.id} className={`p-3 border rounded-lg flex items-center hover:shadow-md transition-all ${index === 0 ? "bg-yellow-100 border-yellow-400 p-4 shadow-lg scale-105" : ""}`} onClick={() => navigate(`/posts/${post.id}`)}>

                                {/* 🔹 1등 트로피 아이콘 */}
                                {index === 0 && (
                                    <FaTrophy className="text-yellow-600 text-lg flex-shrink-0" />
                                )}

                                {/* 🔹 이미지 (없으면 공백 없이 텍스트 영역 앞으로 이동) */}
                                {post.image ? (
                                    <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-300">
                                        <img src={post.image} alt="썸네일" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-0"></div>
                                )}

                                {/* 🔹 게시글 정보 */}
                                <div className="flex-1 px-3 min-w-[200px]">
                                    <h3 className={`text-gray-800 font-bold truncate ${index === 0 ? "text-base text-yellow-800" : "text-sm"}`}>
                                        {post.title.length > 15 ? post.title.slice(0, 15) + "..." : post.title}
                                    </h3>
                                    <div className="flex items-center mt-1">
                                        {/* 🔹 작성자 프로필 (없으면 기본 아이콘) */}
                                        {post.profileImg ? (
                                            <img
                                                src={post.profileImg}
                                                alt="프로필"
                                                className="w-6 h-6 rounded-full mr-2"
                                            />
                                        ) : (
                                            <FaUserCircle className="w-6 h-6 text-gray-400 mr-2" />
                                        )}
                                        <p className="text-xs text-gray-500">{post.writer} • {post.date}</p>
                                    </div>
                                </div>

                                {/* 🔹 좋아요 & 평점 (세로 정렬 & 위치 고정) */}
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

export default CategoryRankingPage;
