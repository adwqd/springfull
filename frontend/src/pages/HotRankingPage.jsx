import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";

// 더미 데이터 (지난 7일간 급상승 랭킹)
const mockData = [
    { id: 1, title: "서브웨이 우즈 정식 레시피", writer: "writer1", date: "2025/02/12", rating: 4.8, likes: 120, image: null },
    { id: 2, title: "GS25 꿀조합 추천", writer: "writer2", date: "2025/02/11", rating: 4.5, likes: 80, image: null },
    { id: 3, title: "내가 만든 최고의 레시피", writer: "writer3", date: "2025/02/10", rating: 4.2, likes: 65, image: null },
    { id: 4, title: "이마트24 한정판 조합", writer: "writer4", date: "2025/02/09", rating: 5.0, likes: 50, image: null },
    { id: 5, title: "서브웨이 & 편의점 콜라보", writer: "writer5", date: "2025/02/08", rating: 3.9, likes: 40, image: null },
    { id: 6, title: "세븐일레븐 라면 꿀조합", writer: "writer6", date: "2025/02/07", rating: 4.6, likes: 30, image: null },
];

const HotRankingPage = () => {
    const navigate = useNavigate();
    const [rankingData, setRankingData] = useState([]);

    useEffect(() => {
        fetchRankingData();
    }, []);

    const fetchRankingData = async () => {
        try {
            // 🔹 실제 API 요청 자리 (현재 더미 데이터 사용)
            /*
            const response = await axios.get("http://localhost:8081/hot-ranking"); 
            setRankingData(response.data);
            */

            // 🔹 더미 데이터를 좋아요 × 별점 평균으로 정렬하여 표시
            const sortedData = [...mockData].sort((a, b) => (b.likes * b.rating) - (a.likes * a.rating));
            setRankingData(sortedData);
        } catch (error) {
            console.error("데이터 불러오기 실패:", error);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto space-y-6">
            {/* 🔹 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center border-b pb-5">
                <h2 className="text-xl font-bold text-center">급상승 랭킹 📈</h2>
                <button onClick={() => navigate("/")} className="text-gray-500 text-sm">
                    ← 홈으로
                </button>
            </div>

            {/* 🔹 랭킹 리스트 */}
            <div className="space-y-4">
                {rankingData.length > 0 ? (
                    rankingData.map((post, index) => (
                        <div
                            key={post.id}
                            className={`border rounded-lg p-3 shadow-sm hover:shadow-md transition flex items-center space-x-3 
                                ${index === 0 ? "bg-yellow-100 border-yellow-400 p-4 shadow-lg scale-105" : ""}`}
                            onClick={() => navigate(`/posts/${post.id}`)}
                        >
                            {/* 🔹 1등 디자인 강조 */}
                            <span className={`text font-bold w-5 ${index === 0 ? "text-yellow-600 text-sm" : ""}`}>
                                {index === 0 ? "🏆" : index + 1}
                            </span>

                            {/* 🔹 이미지 (없으면 숨김) */}
                            {post.image ? (
                                <div className={`w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-300`}>
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 flex-shrink-0"></div>
                            )}

                            {/* 🔹 게시글 정보 */}
                            <div className="flex-1 px-2 min-w-[200px]">
                                <h3 className={`font-bold truncate ${index === 0 ? "text-base text-yellow-800" : "text-sm"}`}>
                                    {post.title.length > 15 ? post.title.slice(0, 15) + "..." : post.title}
                                </h3>
                                <p className="mt-1 text-gray-500 text-xs">{post.writer} • {post.date}</p>
                            </div>

                            {/* 🔹 좋아요 & 별점 (세로 정렬 & 위치 고정) */}
                            <div className="flex flex-col items-end min-w-[70px] text-sm space-y-1">
                                <div className="flex items-center text-yellow-500 space-x-1 w-full justify-end">
                                    <FaStar /> <span className="w-6 text-right text-gray-500">{post.rating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center text-red-500 space-x-1 w-full justify-end">
                                    <FaHeart /> <span className="w-6 text-right text-gray-500">{post.likes}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">이번 주 급상승 게시글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default HotRankingPage;
