import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaHeart, FaUserCircle, FaArrowLeft, FaSearch } from "react-icons/fa";
import axios from "axios";
import Pagination from "../components/Pagination";
import { MyContext } from "../App";

// ✅ 브랜드 목록 (네비게이션용)
const brands = [
    { id: "1", name: "GS25" },
    { id: "2", name: "CU" },
    { id: "3", name: "세븐일레븐" },
    { id: "4", name: "이마트24" },
    { id: "5", name: "서브웨이" },
    { id: "0", name: "기타" }, 
];

const BrandBoardPage = () => {
    const { brand } = useParams();
    const navigate = useNavigate();
    const { apiURL } = useContext(MyContext);

    const [selectedBrand, setSelectedBrand] = useState(brand || "1");
    const [posts, setPosts] = useState([]);
    const [authors, setAuthors] = useState({});
    const [imageUrl, setImageUrl] = useState({});
    const [profileUrl, setProfileUrl] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOption, setSortOption] = useState("1"); // 최신순 기본
    const postsPerPage = 10; // 페이지 당 게시글 수 10개

    const [searchQuery, setSearchQuery] = useState("");

    // 게시글 불러오기 (정렬 및 페이징 적용)
    const fetchPosts = async (brandId, page, sort, keyword = "") => {
        setLoading(true);
        try {
            const response = await axios.post(`${apiURL}/list`, {
                page,
                size: postsPerPage,
                brand: [brandId],
                keyword: keyword.trim() || "", // 공백 검색 방지
                sort: parseInt(sort, 10), //  정수 변환 (1: 최신순, 2: 좋아요순, 3: 평점순)
            });

            if (!response.data || !response.data.dtoList) {
                setPosts([]);
                setTotalPages(1);
                return;
            }

            // 🔹 평점 변환: 10점 만점을 5점 만점으로 변환, 없으면 `0.0`
            let postList = response.data.dtoList.map((post) => ({
                ...post,
                post_like: post.post_like ?? 0, // 좋아요 없으면 0
                star: post.star != null ? (post.star).toFixed(1) : "0.0", // 10점 만점을 5점 만점으로 변환
            }));

            // 프론트에서 0.0도 포함한 정렬 (백엔드가 0.0을 제외하는 경우)
            if (sort === "3") {
                postList = [...postList].sort((a, b) => parseFloat(b.star) - parseFloat(a.star)); // 0.0 포함 정렬
            }

            setPosts(postList);
            setTotalPages(Math.ceil(response.data.total / postsPerPage));

            // 🔹 작성자 정보 조회 (member_uuid 기준)
            const memberIds = [...new Set(postList.map((post) => post.member_uuid).filter(Boolean))];

            if (memberIds.length > 0) {
                const authorsData = {};
                await Promise.all(
                    postList.map(async (postList) => {
                                authorsData[postList.member_uuid] = {
                                    nickname: postList.name || "익명",
                                    profile_img: postList.member_uuid
                                };
                    })
                );
                setAuthors(authorsData);
            }

            // 🔹 썸네일 가져오기
            const imagePromises = postList.map(async (data) => {
                if (!data.thumbnail) return { post_no: data.post_no, imageUrl: null };
                try {
                    const imgResponse = await axios.get(`${apiURL}/view/${data.thumbnail}`, { responseType: "blob" });
                    return { post_no: data.post_no, imageUrl: URL.createObjectURL(imgResponse.data) };
                } catch {
                    return { post_no: data.post_no, imageUrl: null };
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

            const profilePromises = postList.map(async (data) => {
                if (!data.member_uuid) return { post_no: data.post_no, profileUrl: null };
                try {
                    const imgResponse = await axios.get(`${apiURL}/profile/${data.member_uuid}`, { responseType: "blob" });
                    return { post_no: data.post_no, profileUrl: URL.createObjectURL(imgResponse.data) };
                } catch {
                    return { post_no: data.post_no, profileUrl: null };
                }
            });

            const profile = await Promise.all(profilePromises);
            setProfileUrl((prev) => {
                const newImageUrls = { ...prev };
                profile.forEach(({ post_no, profileUrl }) => {
                    newImageUrls[post_no] = profileUrl;
                });
                return newImageUrls;
            });

        } catch (error) {
            console.error("❌ API 호출 실패:", error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchPosts(selectedBrand, currentPage, sortOption, searchQuery);
    }, [selectedBrand, currentPage, sortOption]);

    useEffect(() => {
        if (brand && brand !== selectedBrand) {
            setSelectedBrand(brand);
            setCurrentPage(1);
        }
    }, [brand]);

    // 검색 기능 (검색 버튼 또는 Enter 키 입력)
    const handleSearchSubmit = () => {
        setCurrentPage(1);
        fetchPosts(selectedBrand, 1, sortOption, searchQuery);
    };

    // Enter 키로 검색 실행
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearchSubmit();
        }
    };

    // 정렬 변경 시 기존 검색어 유지
    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSortOption(newSort);
        setCurrentPage(1);
        fetchPosts(selectedBrand, 1, newSort, searchQuery);
    };




    return (
        <div className="p-4 max-w-lg mx-auto space-y-6 lg:max-w-4xl">
            {/* 🔹 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold lg:text-2xl">브랜드 게시판 📌</h2>
                <button onClick={() => navigate(-1)} className="text-gray-500 text-sm lg:text-base flex items-center">
                    <FaArrowLeft className="mr-1" />
                    뒤로 가기
                </button>
            </div>

            {/* 🔹 브랜드 네비게이션 */}
            <div className="flex space-x-3 overflow-x-auto pb-3 border-b">
                {brands.map((b) => (
                    <button
                        key={b.id}
                        onClick={() => navigate(`/brands/${b.id}`)}
                        className={`px-1 py-1 text-sm rounded-md transition lg:px-7 lg:py-2 lg:text-lg ${selectedBrand === b.id ? "text-green-700 font-bold border-b-2 border-green-700" : "text-gray-500"
                            }`}
                    >
                        {b.name}
                    </button>
                ))}
            </div>

            {/* 🔹 정렬 옵션 & 검색 */}
            <div className="grid grid-cols-[5fr_1fr_2fr] gap-2 w-full">
                <input
                    type="text"
                    placeholder="검색어 입력..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress} // Enter 키 검색 추가
                    className="border px-3 py-2 rounded-md w-full"
                />
                <button
                    onClick={handleSearchSubmit}
                    className="bg-gray-500 text-white px-1 py-2 rounded-md w-full flex justify-center items-center"
                >
                    검색
                </button>
                <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="border px-3 py-2 rounded-md w-full"
                >
                    <option value="1">최신순</option>
                    <option value="2">좋아요순</option>
                    <option value="3">평점순</option>
                </select>
            </div>






            {/* 🔹 게시글 목록 */}
            <div>
                {loading ? (
                    <p className="text-center">로딩중...</p>
                ) : posts.length > 0 ? (
                    <ul className="space-y-3">
                        {posts.map((post) => {
                            const author = authors[post.member_uuid] || { nickname: "익명", profile_img: null };
                            return (
                                <li key={post.post_no} className="p-3 border rounded-lg flex justify-between transition hover:shadow-md">
                                    {/* 🔹 게시글 정보 */}
                                    <div className="flex items-center space-x-3">
                                        {imageUrl[post.post_no] && (
                                            <div className="w-20 h-20 flex-shrink-0">
                                                <img src={imageUrl[post.post_no]} alt="thumbnail" className="w-full h-full object-cover rounded-md" />
                                            </div>
                                        )}
                                        <div>
                                            <button onClick={() => navigate(`/posts/${post.post_no}`)} className="block text-gray-800 font-bold text-sm">
                                                {post.title}
                                            </button>
                                            <div className="flex items-center space-x-2 mt-1">
                                                {author.profile_img ? (
                                                    <img src={profileUrl[post.post_no]} alt="profile" className="w-5 h-5 rounded-full" />
                                                ) : (
                                                    <FaUserCircle className="text-gray-400 w-5 h-5" />
                                                )}
                                                <p className="text-gray-500 text-sm">{post.name}</p>
                                            </div>
                                            <p className="text-gray-500 text-xs mt-1">
                                                {post.reg_date} {post.update_date && ` (수정: ${post.update_date})`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 🔹 좋아요 & 별점 */}
                                    {/* 🔹 좋아요 & 별점 */}
                                    <div className="flex flex-col items-end text-sm space-y-2">
                                        <div className="flex items-center text-yellow-500">
                                            <FaStar />
                                            <span className="ml-5 text-gray-500">{post.star}</span> {/* 5점 만점으로 변환된 값 출력 */}
                                        </div>
                                        <div className="flex items-center text-red-500">
                                            <FaHeart />
                                            <span className="ml-5 text-gray-500">{post.post_like}</span>
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

            {/* 🔹 페이지네이션 */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export default BrandBoardPage;
