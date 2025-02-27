import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaHeart, FaTrophy, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import {MyContext} from "../App";

// 카테고리 목록
const categories = [
    { id: "1", name: "편의점" },
    { id: "2", name: "서브웨이" },
    { id: "0", name: "기타" },
    //{ id: "collab", name: "콜라보" }, // 자동 등록
];


const CategoryRankingPage = () => {
    const navigate = useNavigate();
    const { category } = useParams();
    const [selectedCategory, setSelectedCategory] = useState(category || "convenience");
    const [rankingData, setRankingData] = useState([]);
    const [imageUrl, setImageUrl] = useState({});
    const [profileUrl, setProfileUrl] = useState({});
    const {apiURL} = useContext(MyContext);

    useEffect(() => {
        const fetchData = async () => {
            setRankingData([]);
            setImageUrl({});
            setProfileUrl({});
            try {
                const response = await axios.get(`${apiURL}/cateranking/${category}`);
                if (response.data && response.data.length > 0) {
                    console.log(response);
                    setRankingData(response.data);
    
                    // 각 게시물의 썸네일을 가져오는 요청을 병렬 처리
                    const imagePromises = response.data.map(async (data) => {
                        try {
                            if(data.thumbnail === null) return { post_no: data.post_no, imageUrl: null, profileUrl: null };
                            const imgResponse = await axios.get(`${apiURL}/view/${data.thumbnail}`, { responseType: "blob" });
                            const profileResponse = await axios.get(`${apiURL}/view/${data.profile_img}`, { responseType: "blob" });
                            return { post_no: data.post_no, imageUrl: URL.createObjectURL(imgResponse.data), profileUrl: URL.createObjectURL(profileResponse.data) };
                        } catch (error) {
                            console.error("Error fetching image:", error);
                            return { post_no: data.post_no, imageUrl: null };  // 실패 시 null 설정
                        }
                    });
    
                    // 모든 이미지 요청이 완료될 때까지 기다림
                    const images = await Promise.all(imagePromises);
    
                    // imageUrl을 post_no 별로 매핑
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
                    alert("글이 없습니다.");
                    history.back();
                }
            } catch (error) {
                console.error("Error fetching recent posts:", error);
            }
        
        };
    
        fetchData();
    }, [category]);

    // useEffect(() => {
    //     categories.map((tag)=>{
    //         if(tag.name ==category){
    //             setSelectedCategory(tag.id);
    //             console.log(selectedCategory);
    //         }
    //     })
    // }, [category]);


    // const fetchRankingData = async () => {
    //     try {
    //         if (selectedCategory === "collab") {
    //             setRankingData(mockData.filter((post) => post.category.length > 1));
    //         } else {
    //             setRankingData(mockData.filter((post) => post.category.includes(selectedCategory)));
    //         }
    //     } catch (error) {
    //         console.error("데이터 불러오기 실패:", error);
    //     }
    // };

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
                        className={`px-1 py-1 text-sm rounded-md transition ${category === c.id ? "text-green-700 font-bold border-b-2 border-green-700" : "text-gray-500"}`}
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
                            <li
                                key={post.post_no}
                                className={`p-3 border rounded-lg flex items-center hover:shadow-md transition-all ${index === 0 ? "bg-yellow-100 border-yellow-400 p-4 shadow-lg scale-105" : ""
                                    }`}
                                onClick={() => navigate(`/posts/${post.post_no}`)}
                            >
                                {/* 🔹 1등 트로피 아이콘 */}
                                {index === 0 ? (
                                    <FaTrophy className="text-yellow-600 text-lg flex-shrink-0" />
                                ) : (
                                    <span className="text-gray-500 text-sm w-6 text-center font-bold">{index + 1}.</span>
                                )}

                                {/* 🔹 이미지 (없으면 공백 없이 텍스트 영역 앞으로 이동) */}
                                {post.thumbnail ? (
                                    <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-300 ml-3">
                                        <img src={imageUrl[post.post_no]} alt="썸네일" className="w-full h-full object-cover" />
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
                                        {post.profile_img ? (
                                            <img
                                                src={profileUrl[post.post_no]}
                                                alt="프로필"
                                                className="w-4 h-4 rounded-full mr-2"
                                            />
                                        ) : (
                                            <FaUserCircle className="w-6 h-6 text-gray-400 mr-2" />
                                        )}
                                        <p className="text-xs text-gray-500">{post.name} </p>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {post.reg_date} {post.mod_date && `(수정:${post.mod_date})`}
                                    </p>
                                </div>

                                {/* 🔹 좋아요 & 평점 (세로 정렬 & 위치 고정) */}
                                <div className="flex flex-col items-end min-w-[50px] text-sm space-y-1">
                                    <div className="flex items-center text-yellow-500 space-x-1 w-full justify-end">
                                        <FaStar /> <span className="w-6 text-right text-gray-500">{post.star ? post.star.toFixed(1) : "0"}</span>
                                    </div>
                                    <div className="flex items-center text-red-500 space-x-1 w-full justify-end">
                                        <FaHeart /> <span className="w-6 text-right text-gray-500">{post.post_like}</span>
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
