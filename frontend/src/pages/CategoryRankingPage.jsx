import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaHeart, FaTrophy, FaUserCircle } from "react-icons/fa";

// 카테고리 목록: id와 name으로 구성 (id는 API 요청용, name은 화면 표시용)
const categories = [
    { id: "1", name: "편의점" },
    { id: "2", name: "서브웨이" },
    { id: "3", name: "기타" },
    { id: "4", name: "콜라보" }, // 브랜드가 여러개 선택된 경우
];

// 더미 데이터 (실제 API에서는 백엔드에서 MyBatis로 정렬/페이징 처리된 데이터를 반환)
const mockData = [
    {
        id: 1,
        title: "편의점 맛 조합 추천! 최고의 스낵 조합입니다.",
        writer: "writer name",
        date: "2025/01/03",
        update_date: "2025/01/05",
        rating: 4.2,
        likes: 43,
        image: null,
        profileImg: "https://source.unsplash.com/40x40/?person",
        // 게시글이 편의점 카테고리이면 category 배열에 "편의점" 포함
        category: ["편의점"],
    },
    {
        id: 2,
        title: "서브웨이 신메뉴, 건강한 샌드위치 추천!",
        writer: "writer name",
        date: "2025/01/05",
        update_date: "2025/01/05",
        rating: 4.8,
        likes: 17,
        image: "https://source.unsplash.com/80x80/?sandwich",
        profileImg: "https://source.unsplash.com/40x40/?avatar",
        category: ["서브웨이"],
    },
    {
        id: 3,
        title: "내가 만든 최고의 레시피, 직접 해보세요!",
        writer: "writer name",
        date: "2025/01/10",
        update_date: "2025/01/05",
        rating: 4.5,
        likes: 3,
        image: null,
        profileImg: null,
        // 콜라보: 여러 카테고리 선택됨 (예: 편의점과 서브웨이)
        category: ["편의점", "서브웨이"],
    },
];

const CategoryRankingPage = () => {
    const navigate = useNavigate();
    const { category } = useParams(); // URL의 카테고리 id ("1", "2", "3", "4")
    const [selectedCategory, setSelectedCategory] = useState(category || "1");
    const [rankingData, setRankingData] = useState([]);

    // URL 파라미터가 바뀌면 상태 업데이트
    useEffect(() => {
        if (category && category !== selectedCategory) {
            setSelectedCategory(category);
        }
    }, [category, selectedCategory]);

    // 백엔드 API 대신 더미 데이터를 사용하여 해당 카테고리에 맞는 게시글을 필터링
    useEffect(() => {
        fetchRankingData();
    }, [selectedCategory]);

    const fetchRankingData = async () => {
        // 실제 API 호출 시에는 selectedCategory (id)를 파라미터로 전달합니다.
        // 여기서는 더미 데이터에서 필터링합니다.
        if (selectedCategory === "4") {
            // 콜라보: category 배열의 길이가 2 이상인 게시글
            setRankingData(mockData.filter((post) => post.category.length > 1));
        } else {
            // 나머지: id에 따라 매핑 (예: "1" → "편의점", "2" → "서브웨이", "3" → "기타")
            const mapping = {
                "1": "편의점",
                "2": "서브웨이",
                "3": "기타",
            };
            setRankingData(
                mockData.filter((post) => post.category.includes(mapping[selectedCategory]))
            );
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto space-y-6 lg:max-w-4xl lg:space-y-9">
            {/* 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold lg:text-2xl">카테고리 랭킹 🏆</h2>
                <button onClick={() => navigate("/")} className="text-gray-500 text-sm lg:text-base">
                    ← 홈으로
                </button>
            </div>

            {/* 카테고리 선택 리스트 */}
            <div className="flex space-x-3 overflow-x-auto pb-3 border-b">
                {categories.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => navigate(`/category/${c.id}`)}
                        className={`px-1 py-1 text-sm rounded-md transition lg:px-7 lg:py-2 lg:text-lg ${selectedCategory === c.id ? "text-green-700 font-bold border-b-2 border-green-700" : "text-gray-500"
                            }`}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            {/* 게시글 목록 */}
            <div>
                {rankingData.length > 0 ? (
                    <ul className="space-y-3 lg:space-y-5">
                        {rankingData.map((post, index) => (
                            <li
                                key={post.id}
                                className={`p-3 border rounded-lg flex items-center hover:shadow-md transition-all ${index === 0 ? "bg-yellow-100 border-yellow-400 p-5 shadow-lg scale-105" : ""
                                    }`}
                            >
                                {/* 1등 강조: 트로피 아이콘 */}
                                {index === 0 ? (
                                    <FaTrophy className="text-yellow-500 text-2xl lg:text-3xl flex-shrink-0" />
                                ) : (
                                    <span className="text-gray-500 text-sm w-6 text-center font-bold lg:text-lg">{index + 1}</span>
                                )}

                                {/* 이미지 */}
                                {post.image && (
                                    <div className="w-14 h-14 lg:w-16 lg:h-16 flex-shrink-0 rounded-md overflow-hidden ml-3 bg-gray-300">
                                        <img src={post.image} alt="썸네일" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                {/* 게시글 정보 */}
                                <div className="flex-1 px-3 lg:px-5 min-w-[200px]">
                                    <button onClick={() => navigate(`/posts/${post.id}`)} className="text-gray-800 font-semibold block truncate lg:text-lg">
                                        {post.title.length > (window.innerWidth >= 1024 ? 50 : 15)
                                            ? post.title.slice(0, window.innerWidth >= 1024 ? 50 : 15) + "..."
                                            : post.title}
                                    </button>
                                    <div className="flex items-center mt-1 lg:mt-2 space-x-2">
                                        {post.profileImg ? (
                                            <img src={post.profileImg} alt="프로필" className="w-4 h-4 rounded-full lg:w-6 lg:h-6" />
                                        ) : (
                                            <FaUserCircle className="text-gray-400 w-6 h-6" />
                                        )}
                                        <p className="text-gray-500 text-xs lg:text-sm">{post.writer}</p>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1 lg:mt-2 lg:text-sm">
                                        {post.date} {post.update_date && `(수정:${post.update_date})`}
                                    </p>
                                </div>

                                {/* 좋아요 & 평점 */}
                                <div className="flex flex-col items-end min-w-[50px] text-sm space-y-2">
                                    <div className="flex items-center text-yellow-500 space-x-1 w-full justify-end lg:text-base">
                                        <FaStar /> <span className="w-6 lg:w-10 text-right text-gray-500 lg:text-base">{post.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center text-red-500 space-x-1 w-full justify-end lg:text-base">
                                        <FaHeart /> <span className="w-6 lg:w-10 text-right text-gray-500 lg:text-base">{post.likes}</span>
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