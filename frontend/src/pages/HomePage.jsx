import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    { id: 3, title: "요즘 유행하는 서브웨이 조합", price: "3200원", user: "user3" },
    { id: 4, title: "편의점 신상 조합 추천", price: "3500원", user: "user4" },
    { id: 5, title: "이마트24 인기 메뉴", price: "2900원", user: "user5" },
    { id: 6, title: "세븐일레븐 꿀조합", price: "3100원", user: "user6" },
    { id: 7, title: "맛있는 샌드위치 추천", price: "4000원", user: "user7" }
];

const hotRankings = [
    { title: "업데이트 예정", postId: 5 },
    { title: "우즈정식", postId: 6 },
    { title: "하이디라오 소스 추천", postId: 7 }
];

const HomePage = () => {
    const navigate = useNavigate();
    const [categoryRankings, setCategoryRankings] = useState(mockCategoryRankings);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024); // 데스크톱 여부

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="min-h-screen flex flex-col px-2">
            <main className="flex-grow w-full max-w-screen-lg mx-auto px-4 lg:px-20 py-12 lg:space-y-16 space-y-10">

                {/* 🔹 브랜드 게시판 */}
                <div>
                    <h2 className="text-xl font-bold mb-3 lg:text-2xl">브랜드 게시판 📌</h2>
                    <div className="p-4 rounded-md border border-gray-200 shadow-md">
                        <div className=" font-semibold grid grid-cols-3 lg:grid-cols-6 gap-3">
                            {brands.map((brand) => (
                                <button
                                    key={brand}
                                    onClick={() => navigate(`/brands/${brand}`)}
                                    className="bg-green-700 text-white py-2 text-center rounded-md text-sm sm:text-base lg:text-lg hover:bg-green-800 transition"
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {/* 🔹 최근 등록된 글 (카테고리 & 급상승 아래) */}
                <div>
                    <h2 className="text-xl font-bold mb-3 lg:text-2xl">최근 등록된 글 🆕</h2>
                    <div className="grid grid-cols-3 lg:grid-cols-3 lg:gap-6 gap-1.5">
                        {recentPosts.slice(0, isDesktop ? 6 : 3).map((post) => (
                            <div
                                key={post.id}
                                onClick={() => navigate(`/posts/${post.id}`)}
                                className="border rounded-lg text-center p-2 shadow-md cursor-pointer hover:shadow-lg transition"
                            >
                                <div className="w-full h-24 lg:h-36 bg-gray-300 flex items-center justify-center rounded">
                                    <span className="text-gray-500 text-sm">이미지</span>
                                </div>
                                <p className="font-medium text-xs sm:text-sm text-left lg:text-base">{post.title}</p>
                                <p className="text-gray-500 text-xs text-left lg:text-sm">{post.user}</p>
                                <p className="text-gray-600 text-xs sm:text-sm text-left font-semibold">{post.price}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🔹 카테고리 랭킹 & 급상승 랭킹 (데스크톱에서 가로 정렬) */}
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* 🔥 카테고리 랭킹 */}
                    <div className="lg:w-1/2">
                        <h2 className="text-xl font-bold mb-3 lg:text-2xl">카테고리 랭킹 🏆</h2>
                        <div className="p-4 rounded-md border border-gray-200 shadow-md">
                            {categories.map((category) => (
                                <div key={category.id} className="flex justify-between items-center border-b py-2">
                                    <button
                                        onClick={() => navigate(`/category/${category.id}`)}
                                        className="text-base lg:text-lg text-green-700 hover:underline font-semibold"
                                    >
                                        {category.name}
                                    </button>
                                    {categoryRankings[category.id] ? (
                                        <button
                                            onClick={() => navigate(`/posts/${categoryRankings[category.id].postId}`)}
                                            className="text-gray-600 hover:text-green-600 text-sm truncate max-w-[150px] lg:text-base"
                                        >
                                            {categoryRankings[category.id].title}
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 text-sm">게시글 없음</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 🔥 급상승 랭킹 */}
                    <div className="lg:w-1/2">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-bold lg:text-2xl">급상승 랭킹 📈</h2>
                            <button
                                onClick={() => navigate("/hotRanking")}
                                className="text-gray-500 text-sm hover:text-green-600 lg:text-base"
                            >
                                더보기 ➝
                            </button>
                        </div>

                        <div className="border border-gray-200 p-3 rounded-md shadow-md space-y-2">
                            {hotRankings.map((item, index) => (
                                <div key={index} className="border-b py-2">
                                    <button
                                        onClick={() => navigate(`/posts/${item.postId}`)}
                                        className="text-gray-600 hover:text-green-600"
                                    >
                                        {item.title}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


            </main>
        </div>
    );
};

export default HomePage;
