import React, { useState } from "react";
import { FaStar, FaHeart, FaSyncAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const dummyPosts = [
    {
        id: 1,
        category: "편의점",
        brand: "GS25",
        title: "GS25 무더위 카더라 피스타치오 초코바",
        writer: "writer name",
        date: "2025/02/13",
        rating: 4.0,
        likes: 0,
        liked: false,
        tasteTags: ["달콤한 맛", "새콤한 맛"],
        ingredientTags: ["디저트", "스낵류"],
        image: "https://source.unsplash.com/80x80/?snack",
    },
    {
        id: 2,
        category: "편의점",
        brand: "세븐일레븐",
        title: "올레나무 바닐라 아이스크림 먹는법",
        writer: "writer name",
        date: "2025/02/13",
        rating: 3.8,
        likes: 3,
        liked: false,
        tasteTags: ["달콤한 맛"],
        ingredientTags: ["디저트"],
        image: null,
    },
    {
        id: 3,
        category: "서브웨이",
        brand: "서브웨이",
        title: "서브웨이 스테이크&치즈 샌드위치 추천",
        writer: "user123",
        date: "2025/02/14",
        rating: 4.5,
        likes: 10,
        liked: false,
        tasteTags: ["담백한 맛", "느끼한 맛"],
        ingredientTags: ["신선식품", "디저트"],
        image: "https://source.unsplash.com/80x80/?sandwich",
    },
];


const brands = ["GS25", "CU", "세븐일레븐", "이마트24", "서브웨이", "기타"];
const tastes = ["달콤한 맛", "새콤한 맛", "매운 맛", "쓴 맛", "느끼한 맛"];
const ingredients = ["음료/주류", "냉동/냉장식품", "신선식품", "디저트", "라면", "스낵류", "돼지고기/베이컨", "소고기", "닭고기", "에그마요", "새우", "참치", "배달음식", "매장음식", "마이레시피", "기타"];

const SearchDetailPage = () => {
    const [selectedTags, setSelectedTags] = useState({
        brand: [],
        taste: [],
        ingredients: [],
    });

    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false); // ✅ 검색이 실행되었는지 추적하는 상태 추가
    const navigate = useNavigate();

    // ✅ 태그 선택 핸들러
    const handleTagSelect = (type, value) => {
        setSelectedTags((prev) => ({
            ...prev,
            [type]: prev[type]?.includes(value)
                ? prev[type].filter((item) => item !== value) // ✅ 선택 해제
                : [...prev[type], value], // ✅ 선택 추가
        }));
    };

    // ✅ 검색 실행 핸들러
    const handleSearch = () => {
        setSearchPerformed(true); // ✅ 검색 버튼을 누르면 검색이 실행됨

        // ✅ 태그를 선택하지 않으면 모든 게시글을 반환
        if (
            selectedTags.brand.length === 0 &&
            selectedTags.taste.length === 0 &&
            selectedTags.ingredients.length === 0
        ) {
            setSearchResults(dummyPosts);
            return;
        }

        // ✅ 선택한 태그를 기반으로 필터링
        const filteredResults = dummyPosts.filter((post) =>
            selectedTags.brand.includes(post.brand) ||
            selectedTags.taste.some((tag) => post.tasteTags.includes(tag)) ||
            selectedTags.ingredients.some((tag) => post.ingredientTags.includes(tag))
        );

        setSearchResults(filteredResults);
    };

    // ✅ 필터 초기화 함수
    const handleResetFilters = () => {
        setSelectedTags({
            brand: [],
            taste: [],
            ingredients: [],
        });
        setSearchResults([]);
        setSearchPerformed(false); // ✅ 검색 상태 초기화
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <div className="border p-4 rounded-lg shadow-md space-y-4 relative">
                <button onClick={handleResetFilters} className="text-gray-600 text-sm flex items-center justify-center gap-2 absolute top-4 right-1 px-4 py-1">
                    <FaSyncAlt /> 초기화
                </button>

                {/* 브랜드 태그 선택 */}
                <div className="space-y-1.5">
                    <p className="text-sm font-semibold">브랜드</p>
                    <div className="flex flex-wrap gap-1">
                        {brands.map((brand) => (
                            <button
                                key={brand}
                                onClick={() => handleTagSelect("brand", brand)}
                                className={`px-1.5 py-0 text-base rounded-md ${selectedTags.brand.includes(brand) ? "bg-green-100 text-gray-500" : "text-gray-500 border"}`}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 맛 태그 선택 */}
                <div className="mt-4 space-y-1.5">
                    <p className="text-sm font-semibold">맛</p>
                    <div className="flex flex-wrap gap-1">
                        {tastes.map((taste) => (
                            <button
                                key={taste}
                                onClick={() => handleTagSelect("taste", taste)}
                                className={`px-2 py-0 text-base rounded-md ${selectedTags.taste.includes(taste) ? "bg-green-100 text-gray-500" : "text-gray-500 border"}`}
                            >
                                {taste}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 조합 태그 선택 */}
                <div className="mt-4 space-y-1.5">
                    <p className="text-sm font-semibold">조합</p>
                    <div className="flex flex-wrap gap-1">
                        {ingredients.map((ingredient) => (
                            <button
                                key={ingredient}
                                onClick={() => handleTagSelect("ingredients", ingredient)}
                                className={`px-2 py-0 text-base rounded-md ${selectedTags.ingredients.includes(ingredient) ? "bg-green-100 text-gray-500" : "text-gray-500 border"}`}
                            >
                                {ingredient}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 검색 버튼 */}
                <button
                    onClick={handleSearch}
                    className="mt-4 bg-green-600 text-white py-1 w-full rounded-md flex items-center justify-center gap-2"
                >
                    검색
                </button>
            </div>

            {/* 🔹 검색 결과 */}
            {searchPerformed ? (
                searchResults.length > 0 ? (
                    <div className="space-y-4">
                        {searchResults.map((post) => (
                            <div
                                key={post.id}
                                className="border p-3 rounded-lg shadow-md flex items-center hover:shadow-lg transition cursor-pointer"
                                onClick={() => navigate(`/posts/${post.id}`)}
                            >
                                {/* 🔹 이미지 (없으면 공백 없이 텍스트 앞으로 이동) */}
                                {post.image ? (
                                    <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-300">
                                        <img src={post.image} alt="썸네일" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-0"></div>
                                )}

                                {/* 🔹 게시글 정보 */}
                                <div className="flex-1 px-3 min-w-[200px]">
                                    <p className="text-md font-semibold truncate">
                                        {post.title.length > 15 ? post.title.slice(0, 15) + "..." : post.title}
                                    </p>
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
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
                )
            ) : null}
        </div>
    );
};

export default SearchDetailPage;
