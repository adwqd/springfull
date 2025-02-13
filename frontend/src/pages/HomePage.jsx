import React from "react";
import { Link } from "react-router-dom";

const brands = ["GS25", "CU", "세븐일레븐", "이마트24", "서브웨이", "기타"];

const recentPosts = [
    { id: 1, title: "철갑상 찜닭 편의점 초 조합", price: "3200원", user: "user1" },
    { id: 2, title: "우유 맛없다면 먹어보는 신선조합", price: "2300원", user: "user2" },
    { id: 3, title: "요즘 유행하는 서브웨이 조합", price: "3200원", user: "user3" }
];

const categoryRankings = [
    { category: "편의점", title: "닭볶이+숙주=마라탕 조합", user: "user3" },
    { category: "서브웨이", title: "우주최강", user: "user5" },
    { category: "기타", title: "하이드라소스 추천", user: "user6" },
    { category: "콜라보", title: "업데이트 예정", user: "user7" }
];

const hotRankings = [
    { title: "업데이트 예정", user: "user3" },
    { title: "우주최강", user: "user5" },
    { title: "하이드라소스 추천", user: "user6" }
];

const HomePage = () => {
    return (
        <div className="p-4 max-w-md mx-auto space-y-6">
            {/* 브랜드 이동 버튼 */}
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold mb-3">브랜드 게시판 📌</h2>
                </div>
                <div className="bg-gray-100 p-4 px-7 rounded-sm space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                        {brands.map((brand) => (
                            <Link
                                key={brand}
                                to={`/brands/${brand}`}
                                className="bg-green-700 text-white py-1.5 text-center rounded-md text-[15px]"
                            >
                                {brand}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* 최근 등록된 글 */}
            <div>
                <h2 className="text-lg font-bold mb-3">최근 등록된 글 🆕</h2>
                <div className="grid grid-cols-3 gap-3">
                    {recentPosts.map((post) => (
                        <div key={post.id} className="border rounded-lg text-center p-2">
                            <div className="w-full h-20 bg-gray-300 mb-2 flex items-center justify-center rounded">
                                <span className="text-gray-500 text-sm">이미지</span>
                            </div>
                            <p className="font-medium text-xs text-left">{post.title}</p>
                            <p className="text-gray-600 text-xs text-left">{post.price}</p>
                            <p className="text-gray-500 text-xs text-left">{post.user}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 카테고리 랭킹 */}
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold mb-3">카테고리 랭킹 🏆</h2>
                    <Link to="/category/:category" className="text-gray-500 text-sm">더보기 ➝</Link>
                </div>
                <div className="bg-gray-100 p-3 rounded-sm space-y-2">
                    {categoryRankings.map((item, index) => (
                        <div key={index} className="flex justify-between border-b py-1 text-sm">
                            <Link
                                to={`/category/${item.category}`}
                                className="text-green-700 font-bold mb-3"
                            >
                                {item.category}
                            </Link>
                            <Link
                                to={`/post/${item.title}`}
                                className="text-gray-600 hover:text-green-600"
                            >
                                {item.title}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* 급상승 랭킹 */}
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold mb-3">급상승 랭킹 📈</h2>
                    <Link to="/hotRanking" className="text-gray-500 text-sm">더보기 ➝</Link>
                </div>
                <div className="bg-gray-100 p-3 rounded-sm space-y-2">
                    {hotRankings.map((item, index) => (
                        <div key={index} className="border-b py-1 text-sm">
                            <Link
                                to={`/post/${item.title}`}
                                className="text-gray-600 hover:text-green-600"
                            >
                                {item.title}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
