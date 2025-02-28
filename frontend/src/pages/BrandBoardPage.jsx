import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaStar, FaUserCircle } from "react-icons/fa";
import Pagination from "../components/Pagination"; // Pagination 컴포넌트 경로

// 브랜드 정보를 id와 name으로 설정 (예: GS25: id "1", CU: id "2", …)
const brands = [
    { id: "1", name: "GS25" },
    { id: "2", name: "CU" },
    { id: "3", name: "세븐일레븐" },
    { id: "4", name: "이마트24" },
    { id: "5", name: "서브웨이" },
    { id: "6", name: "기타" },
];

// 더미 응답 데이터 예시 (브랜드 id에 따라 다르게 처리)
const dummyResponseData = {
    "1": {
        page: 1,
        size: 10,
        total: 23,
        start: 1,
        end: 10,
        prev: false,
        next: true,
        dtoList: [
            {
                post_no: 1,
                title: "GS25 최고의 조합은 정말 대박이에요, 먹어봐야 합니다!",
                member_uuid: "writer1",
                name: "GS25",
                post_like: 5,
                cost: 10000,
                star: 4.5,
                thumbnail: "https://source.unsplash.com/80x80/?food",
                profile_img: "https://source.unsplash.com/40x40/?person",
                reg_Date: "2025-01-03T00:00:00Z",
                state: 1,
            },
            {
                post_no: 2,
                title: "GS25 신상 조합 대박!",
                member_uuid: "writer2",
                name: "GS25",
                post_like: 300,
                cost: 12000,
                star: 4.2,
                thumbnail: "",
                profile_img: "",
                reg_Date: "2025-01-02T00:00:00Z",
                state: 1,
            },
            // ... (게시글 10개라고 가정)
        ],
    },
    "2": {
        page: 1,
        size: 10,
        total: 15,
        start: 1,
        end: 10,
        prev: false,
        next: true,
        dtoList: [
            {
                post_no: 3,
                title: "CU 핫한 조합 지금 난리 났어요",
                member_uuid: "writer3",
                name: "CU",
                post_like: 7,
                cost: 9000,
                star: 5.0,
                thumbnail: "https://source.unsplash.com/80x80/?drink",
                profile_img: "https://source.unsplash.com/40x40/?avatar",
                reg_Date: "2025-01-01T00:00:00Z",
                state: 1,
            },
            // ... (게시글 10개라고 가정)
        ],
    },
    // dummyResponseData["3"], ["4"], ["5"], ["6"] 필요 시 추가
};

const BrandBoardPage = () => {
    // URL 파라미터로 브랜드 id를 받음 (예: "/brands/1")
    const { brand } = useParams();
    const navigate = useNavigate();

    // selectedBrand: URL에서 받은 값이 없으면 기본 "1" (GS25)
    const [selectedBrand, setSelectedBrand] = useState(brand || "1");
    const [sortOption, setSortOption] = useState("1"); // "1": 최신순, "2": 좋아요순, "3": 평점순
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // 백엔드에서 처리된 결과 (정렬 및 페이징 처리된 데이터)
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // 백엔드 API 호출 (여기서는 더미 데이터 사용)
    const fetchPosts = (brand, page, sort, search) => {
        setLoading(true);
        // 실제 API 호출 예시:
        // axios.get('/api/posts', { params: { page, size:10, category: [], brand: [brand], taste: [], ingredient: [], min_cost:0, max_cost:0, keyword: search, member_uuid:"", sort, ingredientsize:0, brandsize:0, tastesize:0, skip:0 } })
        //   .then(response => {
        //     setPosts(response.data.dtoList);
        //     setTotalPages(Math.ceil(response.data.total / response.data.size));
        //   })
        //   .catch(error => console.error("API 호출 실패", error))
        //   .finally(() => setLoading(false));

        setTimeout(() => {
            const dummyData = dummyResponseData[selectedBrand] || { dtoList: [], total: 0, size: 10 };
            setPosts(dummyData.dtoList);
            setTotalPages(Math.ceil(dummyData.total / dummyData.size));
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        fetchPosts(selectedBrand, currentPage, sortOption, searchQuery);
    }, [selectedBrand, currentPage, sortOption, searchQuery]);

    useEffect(() => {
        // URL 파라미터 brand가 바뀌면 상태 업데이트
        if (brand && brand !== selectedBrand) {
            setSelectedBrand(brand);
            setCurrentPage(1);
        }
    }, [brand]);

    // 브랜드 선택 시, URL을 "/brands/{newBrand}"로 변경
    const handleBrandChange = (newBrandId) => {
        if (selectedBrand !== newBrandId) {
            setSelectedBrand(newBrandId);
            setCurrentPage(1);
            navigate(`/brands/${newBrandId}`, { replace: true });
        }
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-4 max-w-lg mx-auto space-y-6 lg:max-w-4xl">
            {/* 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold lg:text-2xl">브랜드 게시판 📌</h2>
                <button onClick={() => navigate("/")} className="text-gray-500 text-sm lg:text-base">
                    ← 홈으로
                </button>
            </div>

            {/* 브랜드 선택 리스트 */}
            <div className="flex space-x-3 overflow-x-auto pb-3 border-b">
                {brands.map((b) => (
                    <button
                        key={b.id}
                        onClick={() => handleBrandChange(b.id)}
                        className={`px-0 py-1 text-sm rounded-md transition lg:px-7 lg:py-2 lg:text-lg ${selectedBrand === b.id ? "text-green-700 font-bold border-b-2 border-green-700" : "text-gray-500"
                            }`}
                    >
                        {b.name}
                    </button>
                ))}
            </div>

            {/* 검색창 & 정렬 옵션 */}
            <div className="flex justify-between items-center space-x-2">
                <input
                    type="text"
                    placeholder="게시글 검색..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border px-3 py-1 lg:py-2 w-full rounded-md"
                />
                <select value={sortOption} onChange={handleSortChange} className="border px-3 py-1 lg:py-2 rounded-md">
                    <option value="1">최신순</option>
                    <option value="2">좋아요순</option>
                    <option value="3">평점순</option>
                </select>
            </div>

            {/* 게시글 목록 */}
            <div>
                {loading ? (
                    <p className="text-center">로딩중...</p>
                ) : posts.length > 0 ? (
                    <ul className="space-y-3 lg:space-y-5">
                        {posts.map((post) => {
                            const thumbnail = post.thumbnail;
                            return (
                                <li
                                    key={post.post_no}
                                    className="p-3 border rounded-lg flex items-center hover:shadow-md transition-all"
                                >
                                    {thumbnail && (
                                        <div className="w-14 h-14 lg:w-16 lg:h-16 flex-shrink-0 rounded-md overflow-hidden">
                                            <img src={thumbnail} alt="썸네일" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    {/* 게시글 정보 */}
                                    <div className="flex-1 px-3 lg:px-5 min-w-[200px]">
                                        <button
                                            onClick={() => navigate(`/posts/${post.post_no}`)}
                                            className="text-gray-800 font-bold block truncate"
                                        >
                                            {post.title.length > (window.innerWidth >= 1024 ? 30 : 15)
                                                ? post.title.slice(0, window.innerWidth >= 1024 ? 30 : 15) + "..."
                                                : post.title}
                                        </button>
                                        <div className="flex items-center mt-1 space-x-2">
                                            {post.profile_img ? (
                                                <img src={post.profile_img} alt="프로필" className="w-4 h-4 rounded-full lg:w-6 lg:h-6" />
                                            ) : (
                                                <FaUserCircle className="text-gray-400 w-6 h-6" />
                                            )}
                                            <p className="text-gray-500 text-xs lg:text-sm">{post.member_uuid}</p>
                                        </div>
                                        <p className="text-gray-400 text-xs mt-1">
                                            {post.reg_Date} {post.mod_date && `(수정:${post.mod_date})`}
                                        </p>
                                    </div>
                                    {/* 좋아요 & 별점 */}
                                    <div className="flex flex-col items-end min-w-[70px] text-sm space-y-2">
                                        <div className="flex items-center text-yellow-500 space-x-1 w-full justify-end lg:text-base">
                                            <FaStar />
                                            <span className="w-6 lg:w-10 text-right text-gray-500 lg:text-base">
                                                {post.star.toFixed(1)}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-red-500 space-x-1 w-full justify-end lg:text-base">
                                            <FaHeart />
                                            <span className="w-6 lg:w-10 text-right text-gray-500 lg:text-base">
                                                {post.post_like}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center">게시글이 없습니다.</p>
                )}
            </div>

            {/* 페이지 네이션 영역 */}
            <div className="mt-6">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default BrandBoardPage;
