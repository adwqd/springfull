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
        <div className="p-4 max-w-lg mx-auto space-y-6 lg:max-w-4xl lg:space-y-9">
            {/* 🔹 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold lg:text-2xl">급상승 랭킹 📈</h2>
                <button onClick={() => navigate("/")} className="text-gray-500 text-sm lg:text-base">← 홈으로</button>
            </div>

            {/* 🔹 랭킹 리스트 */}
            <div>
                {rankingData.length > 0 ? (
                    <ul className=" space-y-3 lg:space-y-5">
                        {rankingData.map((post, index) => (
                            <li key={post.id} className={`p-3 border rounded-lg flex items-center hover:shadow-md transition-all ${index === 0 ? "bg-yellow-100 border-yellow-400 p-4 shadow-lg scale-105" : ""}`} onClick={() => navigate(`/posts/${post.id}`)}>
                                {/* 🔹 1등 트로피 아이콘 / 2등 이후 숫자 */}
                                <div className="w-6 flex items-center justify-center text-gray-600 font-bold ">
                                    {index === 0 ? <FaTrophy className="text-yellow-600 text-lg lg:text-3xl" /> : index + 1}
                                </div>

                                {/* 🔹 등수와 이미지 사이 간격 확대 */}
                                {post.image ? (
                                    <div className="w-14 h-14 lg:w-16 lg:h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-300 ml-3">
                                        <img src={post.image} alt="썸네일" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-0"></div>
                                )}

                                {/* 🔹 게시글 정보 */}
                                <div className="flex-1 px-3 lg:px-5 min-w-[200px]">
                                    <h3 className="text-gray-800 font-bold truncate lg:text-lg">
                                        {post.title.length > (window.innerWidth >= 1024 ? 30 : 15) ? post.title.slice(0, window.innerWidth >= 1024 ? 30 : 15) + "..." : post.title}
                                    </h3>
                                    <div className="flex items-center mt-1 lg:mt-2 space-x-2">
                                        {/* 🔹 작성자 프로필 (없으면 기본 아이콘) */}
                                        {post.profileImg ? (
                                            <img src={post.profileImg} alt="프로필" className="w-4 h-4 rounded-full lg:w-6 lg:h-6" />
                                        ) : (
                                            <FaUserCircle className="text-gray-400 w-6 h-6" />
                                        )}
                                        <p className="text-gray-500 text-xs lg:text-sm">{post.writer}</p>
                                    </div>
                                    {/* 🔹 날짜 */}
                                    <p className="text-gray-400 text-xs mt-1 lg:mt-2 lg:text-sm">
                                        {post.updatedDate ? `${post.date} (수정: ${post.updatedDate})` : post.date}
                                    </p>
                                </div>

                                {/* 🔹 좋아요 & 평점 */}
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
                    <p className="text-gray-500 text-center">이번 주 급상승 게시글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default HotRankingPage;
