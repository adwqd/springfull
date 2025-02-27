import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaTrophy, FaUserCircle } from "react-icons/fa";

// 더미 데이터 (지난 7일간 급상승 랭킹)
const mockData = [
    { id: 1, title: "서브웨이 우즈 정식 레시피", writer: "writer1", date: "2025/02/12", updatedDate: "2025/02/14", rating: 4.8, likes: 120, image: null, profileImg: "https://source.unsplash.com/40x40/?person" },
    { id: 2, title: "GS25 꿀조합 추천", writer: "writer2", date: "2025/02/11", updatedDate: null, rating: 4.5, likes: 80, image: "https://source.unsplash.com/80x80/?food", profileImg: "https://source.unsplash.com/40x40/?avatar" },
    { id: 3, title: "내가 만든 최고의 레시피", writer: "writer3", date: "2025/02/10", updatedDate: "2025/02/13", rating: 4.2, likes: 65, image: null, profileImg: null },
    { id: 4, title: "이마트24 한정판 조합", writer: "writer4", date: "2025/02/09", updatedDate: null, rating: 5.0, likes: 50, image: null, profileImg: "https://source.unsplash.com/40x40/?face" },
];

const HotRankingPage = () => {
    const navigate = useNavigate();
    const [rankingData, setRankingData] = useState([]);

    useEffect(() => {
        fetchRankingData();
    }, []);

    const fetchRankingData = async () => {
        try {
            const sortedData = [...mockData].sort((a, b) => (b.likes * b.rating) - (a.likes * a.rating));
            setRankingData(sortedData);
        } catch (error) {
            console.error("데이터 불러오기 실패:", error);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto space-y-6">
            {/* 🔹 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">급상승 랭킹 📈</h2>
                <button onClick={() => navigate("/")} className="text-gray-500 text-sm">
                    ← 홈으로
                </button>
            </div>

            {/* 🔹 랭킹 리스트 */}
            <div>
                {rankingData.length > 0 ? (
                    <ul className="space-y-3">
                        {rankingData.map((post, index) => (
                            <li
                                key={post.id}
                                className={`p-3 border rounded-lg flex items-center hover:shadow-md transition-all ${index === 0 ? "bg-yellow-100 border-yellow-400 p-3 shadow-lg" : ""
                                    }`}
                                onClick={() => navigate(`/posts/${post.id}`)}
                            >
                                {/* 🔹 1등 트로피 아이콘 / 2등 이후 숫자 */}
                                <div className="w-6 flex items-center justify-center text-gray-600 font-bold">
                                    {index === 0 ? <FaTrophy className="text-yellow-600 text-lg" /> : index + 1}
                                </div>

                                {/* 🔹 등수와 이미지 사이 간격 확대 (ml-6) */}
                                {post.image ? (
                                    <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-300 ml-3">
                                        <img src={post.image} alt="썸네일" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-0"></div>
                                )}

                                {/* 🔹 게시글 정보 */}
                                <div className="flex-1 px-3 min-w-[200px]">
                                    <h3 className={`text-gray-800 font-bold truncate text-sm`}>
                                        {post.title.length > 15 ? post.title.slice(0, 15) + "..." : post.title}
                                    </h3>
                                    <div className="flex items-center mt-1">
                                        {/* 🔹 작성자 프로필 (없으면 기본 아이콘) */}
                                        {post.profileImg ? (
                                            <img
                                                src={post.profileImg}
                                                alt="프로필"
                                                className="w-4 h-4 rounded-full mr-2"
                                            />
                                        ) : (
                                            <FaUserCircle className="w-6 h-6 text-gray-400 mr-2" />
                                        )}
                                        <p className="text-xs text-gray-500">{post.writer}</p>
                                    </div>
                                    {/* 🔹 날짜 (수정일 있으면 표시) */}
                                    <p className="text-xs text-gray-500">
                                        {post.updatedDate ? `${post.date} (수정: ${post.updatedDate})` : post.date}
                                    </p>
                                </div>

                                {/* 🔹 좋아요 & 평점 (세로 정렬 & 위치 고정) */}
                                <div className="flex flex-col items-end min-w-[50px] text-sm space-y-1">
                                    <div className="flex items-center text-yellow-500 space-x-1">
                                        <FaStar /> <span className="text-gray-500">{post.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center text-red-500 space-x-1">
                                        <FaHeart /> <span className="text-gray-500">{post.likes}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center">이번 주 급상승 게시글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default HotRankingPage;
