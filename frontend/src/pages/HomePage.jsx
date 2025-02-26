import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrendingUp } from "react-icons/fi";

const categories = [
    { id: "convenience", name: "편의점" },
    { id: "subway", name: "서브웨이" },
    { id: "others", name: "기타" },
    { id: "collab", name: "콜라보" }
];

const brands = ["GS25", "CU", "세븐일레븐", "이마트24", "서브웨이", "기타"];

const mockCategoryRankings = {
    convenience: { title: "연세우유 생크림빵 조합", postId: 1 },
    subway: { title: "우즈정식", postId: 2 },
    others: { title: "하이디라오 소스 추천", postId: 3 },
    collab: { title: "엽떡에 어울리는 토핑", postId: 4 }
};

const recentPosts = [
    { id: 1, title: "미식만두랑 잘어울리는 라면", price: "3200원", user: "user1" },
    { id: 2, title: "우유 말먹하는 초코과자", price: "2300원", user: "user2" },
    { id: 3, title: "요즘 유행하는 서브웨이 조합", price: "3200원", user: "user3" }
];

const hotRankings = [
    { title: "업데이트 예정", postId: 5 },
    { title: "우즈정식", postId: 6 },
    { title: "하이디라오 소스 추천", postId: 7 }
];

const HomePage = () => {
    const navigate = useNavigate();
    const [categoryRankings, setCategoryRankings] = useState(mockCategoryRankings);

    useEffect(() => {
        const fetchCategoryRankings = async () => {
            try {
                /*
                const response = await fetch("YOUR_API_ENDPOINT");
                const data = await response.json();
                setCategoryRankings(data);
                */
            } catch (error) {
                console.error("카테고리 랭킹 불러오기 실패:", error);
            }
        };

        fetchCategoryRankings();
    }, []);

    return (
        <div className="min-h-screen flex flex-col px-1">
            {/* ✅ 페이지 전체 레이아웃 */}
            <main className="flex-grow w-full max-w-2xl mx-auto px-4 lg:px-8 py-6 space-y-10">
                {/* 🔹 브랜드 게시판 */}
                <div>
                    <h2 className="text-xl font-bold mb-3">브랜드 게시판 📌</h2>
                    <div className="p-4 rounded-md border border-gray-200 shadow-md space-y-2">
                        <div className="grid grid-cols-3 gap-4">
                            {brands.map((brand) => (
                                <div
                                    key={brand}
                                    onClick={() => navigate(`/brands/${brand}`)}
                                    className="bg-green-700 text-white py-1.5 text-center rounded-md text-[15px] cursor-pointer hover:bg-green-800"
                                >
                                    {brand}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 🔹 최근 등록된 글 */}
                <div>
                    <h2 className="text-xl font-bold mb-3">최근 등록된 글 🆕</h2>
                    <div className="grid grid-cols-3 gap-1.5">
                        {recentPosts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => navigate(`/posts/${post.id}`)} // ✅ 해당 글 상세보기로 이동
                                className="border rounded-lg text-center p-2 shadow-md cursor-pointer hover:shadow-lg transition"
                            >
                                <div className="w-full h-20 bg-gray-300 mb-2 flex items-center justify-center rounded">
                                    <span className="text-gray-500 text-sm">이미지</span>
                                </div>
                                <p className="font-medium text-xs text-left">{post.title}</p>
                                <p className="text-gray-500 text-xs text-left">{post.user}</p>
                                <p className="text-gray-600 text-xs text-left font-semibold">{post.price}</p>
                            </div>
                        ))}
                    </div>
                </div>


                {/* 🔹 카테고리 랭킹 */}
                <div>
                    <h2 className="text-xl font-bold mb-3">카테고리 랭킹 🏆</h2>
                    <div className="p-4 rounded-md border border-gray-200 shadow-md space-y-2">
                        {categories.map((category) => (
                            <div key={category.id} className="flex justify-between items-center border-b py-2">
                                <div
                                    onClick={() => navigate(`/category/${category.id}`)}
                                    className="text-base text-green-700 hover:underline cursor-pointer font-semibold"
                                >
                                    {category.name}
                                </div>
                                {categoryRankings[category.id] ? (
                                    <div
                                        onClick={() => navigate(`/posts/${categoryRankings[category.id].postId}`)}
                                        className="text-gray-600 hover:text-green-600 text-sm cursor-pointer truncate max-w-[150px]"
                                    >
                                        {categoryRankings[category.id].title.length > 15
                                            ? categoryRankings[category.id].title.slice(0, 15) + "..."
                                            : categoryRankings[category.id].title}
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-sm">게시글 없음</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🔹 급상승 랭킹 */}
                <div>
                    {/* ✅ "더보기" 버튼을 제목 오른쪽 상단으로 배치 */}
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold">급상승 랭킹 📈</h2>
                        <div
                            onClick={() => navigate("/hotRanking")}
                            className="text-gray-500 text-sm hover:text-green-600 cursor-pointer"
                        >
                            더보기 ➝
                        </div>
                    </div>

                    <div className="border border-gray-200 p-3 rounded-sm space-y-2 shadow-md">
                        {hotRankings.map((item, index) => (
                            <div key={index} className="border-b py-1 text-base">
                                <div
                                    onClick={() => navigate(`/posts/${item.postId}`)}
                                    className="text-gray-600 hover:text-green-600 cursor-pointer"
                                >
                                    {item.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
