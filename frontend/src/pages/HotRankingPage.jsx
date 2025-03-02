import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaTrophy, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { MyContext } from "../App";

const HotRankingPage = () => {
    const navigate = useNavigate();
    const [rankingData, setRankingData] = useState([]);
    const [imageUrl, setImageUrl] = useState({});
    const [profileUrl, setProfileUrl] = useState({});

    const { apiURL } = useContext(MyContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiURL}/hotranking`);
                if (response.data && response.data.length > 0) {
                    setRankingData(response.data);

                    // 🔹 이미지 & 프로필 비동기 요청
                    const imagePromises = response.data.map(async (data) => {
                        try {
                            const imgResponse = data.thumbnail
                                ? await axios.get(`${apiURL}/view/${data.thumbnail}`, { responseType: "blob" })
                                : null;
                            const profileResponse = data.profile_img
                                ? await axios.get(`${apiURL}/view/${data.profile_img}`, { responseType: "blob" })
                                : null;

                            return {
                                post_no: data.post_no,
                                imageUrl: imgResponse ? URL.createObjectURL(imgResponse.data) : null,
                                profileUrl: profileResponse ? URL.createObjectURL(profileResponse.data) : null,
                            };
                        } catch {
                            return { post_no: data.post_no, imageUrl: null, profileUrl: null };
                        }
                    });

                    const images = await Promise.all(imagePromises);

                    setImageUrl((prev) => {
                        const newImageUrls = { ...prev };
                        images.forEach(({ post_no, imageUrl }) => {
                            newImageUrls[post_no] = imageUrl;
                        });
                        return newImageUrls;
                    });

                    setProfileUrl((prev) => {
                        const newProfileUrls = { ...prev };
                        images.forEach(({ post_no, profileUrl }) => {
                            newProfileUrls[post_no] = profileUrl;
                        });
                        return newProfileUrls;
                    });

                } else {
                    alert("급상승 게시글이 없습니다.");
                    navigate(-1);
                }
            } catch (error) {
                console.error("🔥 급상승 랭킹 불러오기 실패:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4 max-w-lg mx-auto space-y-6 lg:max-w-4xl">
            {/* 🔹 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold lg:text-2xl">급상승 랭킹 📈</h2>
                <button onClick={() => navigate(-1)} className="text-gray-500 text-sm lg:text-base flex items-center">
                    ← 뒤로 가기
                </button>
            </div>

            {/* 🔹 게시글 목록 */}
            <div>
                {rankingData.length > 0 ? (
                    <ul className="space-y-3">
                        {rankingData.map((post, index) => (
                            <li
                                key={post.post_no}
                                className={`p-3 border rounded-lg flex justify-between items-center transition hover:shadow-md ${index === 0 ? "bg-yellow-100 border-yellow-400 p-4 shadow-lg scale-105" : ""}`}
                                onClick={() => navigate(`/posts/${post.post_no}`)}
                            >
                                {/* 🔹 숫자 or 트로피 아이콘 (세로 중앙 정렬) */}
                                <div className="flex items-center">
                                    {index === 0 ? (
                                        <FaTrophy className="text-yellow-600 text-lg mr-3" />
                                    ) : (
                                        <span className="text-gray-500 text-sm font-bold mr-3 w-6 flex items-center justify-center">
                                            {index + 1}.
                                        </span>
                                    )}
                                </div>

                                {/* 🔹 이미지 (없으면 공백 없이 텍스트 영역 앞으로 이동) */}
                                {post.thumbnail ? (
                                    <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-300">
                                        <img src={imageUrl[post.post_no]} alt="썸네일" className="w-full h-full object-cover" />
                                    </div>
                                ) : null}

                                {/* 🔹 게시글 정보 */}
                                <div className="flex-1 px-3 min-w-[200px]">
                                    <h3 className="text-gray-800 font-bold truncate text-sm lg:text-base">
                                        {post.title.length > 20 ? post.title.slice(0, 20) + "..." : post.title}
                                    </h3>
                                    <div className="flex items-center mt-1">
                                        {/* 🔹 작성자 프로필 (없으면 기본 아이콘) */}
                                        {post.profile_img ? (
                                            <img src={profileUrl[post.post_no]} alt="프로필" className="w-5 h-5 rounded-full mr-2" />
                                        ) : (
                                            <FaUserCircle className="w-6 h-6 text-gray-400 mr-2" />
                                        )}
                                        <p className="text-xs text-gray-500">{post.name}</p>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {post.mod_date ? `${post.reg_date} (수정: ${post.mod_date})` : post.reg_date}
                                    </p>
                                </div>

                                {/* 🔹 좋아요 & 평점 (세로 정렬 & 위치 고정) */}
                                <div className="flex flex-col items-end min-w-[50px] text-sm space-y-1">
                                    <div className="flex items-center text-yellow-500 space-x-1 w-full justify-end">
                                        <FaStar /> <span className="w-6 text-right text-gray-500">{post.star ? parseFloat(post.star).toFixed(1) : "0"}</span>
                                    </div>
                                    <div className="flex items-center text-red-500 space-x-1 w-full justify-end">
                                        <FaHeart /> <span className="w-6 text-right text-gray-500">{post.post_like}</span>
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
