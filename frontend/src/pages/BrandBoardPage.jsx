import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaHeart, FaUserCircle, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { MyContext } from "../App";
import Pagination from "../components/Pagination";

// ✅ 브랜드 목록 (6이 콜라보 브랜드)
const brands = [
    { id: "0", name: "기타" },
    { id: "1", name: "GS25" },
    { id: "2", name: "CU" },
    { id: "3", name: "세븐일레븐" },
    { id: "4", name: "이마트24" },
    { id: "5", name: "서브웨이" },
    { id: "6", name: "콜라보" }, // ✅ 6이 콜라보
];

const BrandBoardPage = () => {
    const { brand } = useParams();
    const navigate = useNavigate();
    const { apiURL } = useContext(MyContext);

    const [selectedBrand, setSelectedBrand] = useState(brand || "1");
    const [posts, setPosts] = useState([]);
    const [profileUrl, setProfileUrl] = useState({});
    const [imageUrl, setImageUrl] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState("1");
    const postsPerPage = 10;
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    // ✅ 게시글 불러오기 (프로필 & 썸네일 포함)
    const fetchPosts = async (brandId, page, sort, keyword = "") => {
        setLoading(true);
        try {
            const response = await axios.post(`${apiURL}/list`, {
                page,
                size: postsPerPage,
                brand: brandId === "6" ? [] : [brandId],
                keyword: keyword.trim() || "",
                sort: sort === "3" ? 1 : parseInt(sort, 10),
            });

            if (!response.data || !response.data.dtoList) {
                setPosts([]);
                return;
            }

            let postList = response.data.dtoList.map((post) => ({
                ...post,
                post_like: post.post_like ?? 0,
                star: post.star != null ? (post.star / 2).toFixed(1) : "0.0",
            }));

            // ✅ 브랜드가 2개 이상 포함된 게시글만 '콜라보' 게시판에서 표시
            if (brandId === "6") {
                postList = postList.filter((post) => Array.isArray(post.brand) && post.brand.length > 1);
            }

            setPosts(postList);

            // ✅ 작성자 프로필 가져오기
            const profilePromises = postList.map(async (post) => {
                if (!post.profile_img) return { post_no: post.post_no, profileUrl: null };
                try {
                    const profileResponse = await axios.get(`${apiURL}/view/${post.profile_img}`, { responseType: "blob" });
                    return { post_no: post.post_no, profileUrl: URL.createObjectURL(profileResponse.data) };
                } catch {
                    return { post_no: post.post_no, profileUrl: null };
                }
            });

            const profileImages = await Promise.all(profilePromises);
            setProfileUrl((prev) => {
                const newProfileUrls = { ...prev };
                profileImages.forEach(({ post_no, profileUrl }) => {
                    newProfileUrls[post_no] = profileUrl;
                });
                return newProfileUrls;
            });

            // ✅ 썸네일 가져오기
            const imagePromises = postList.map(async (post) => {
                if (!post.thumbnail) return { post_no: post.post_no, imageUrl: null };
                try {
                    const imgResponse = await axios.get(`${apiURL}/view/${post.thumbnail}`, { responseType: "blob" });
                    return { post_no: post.post_no, imageUrl: URL.createObjectURL(imgResponse.data) };
                } catch {
                    return { post_no: post.post_no, imageUrl: null };
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

    // ✅ 검색 실행 함수
    const handleSearch = () => {
        fetchPosts(selectedBrand, 1, sortOption, searchQuery);
        setCurrentPage(1);
    };

    // ✅ 엔터 키 입력 시 검색 실행
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto space-y-6 lg:max-w-4xl">
            {/* 🔹 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold lg:text-2xl">브랜드 게시판 📌</h2>
                <button onClick={() => navigate(-1)} className="text-gray-500 text-sm lg:text-base flex items-center">
                    <FaArrowLeft className="mr-1" /> 뒤로 가기
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
            {/* 🔹 검색 & 정렬 */}
            <div className="grid grid-cols-[5fr_1fr_2fr] gap-2 w-full">
                <input
                    type="text"
                    placeholder="검색어 입력..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="border px-3 py-2 rounded-md w-full"
                />
                <button onClick={handleSearch} className="bg-gray-500 text-white px-1 py-2 rounded-md flex justify-center items-center">
                    검색
                </button>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="border px-3 py-2 rounded-md w-full">
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
                        {posts.map((post) => (
                            <li key={post.post_no} className="p-3 border rounded-lg flex justify-between transition hover:shadow-md cursor-pointer" onClick={() => navigate(`/posts/${post.post_no}`)}>
                                <div className="flex items-center space-x-3">
                                    {imageUrl[post.post_no] && (
                                        <div className="w-20 h-20 flex-shrink-0">
                                            <img src={imageUrl[post.post_no]} alt="thumbnail" className="w-full h-full object-cover rounded-md" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-gray-800 font-bold text-sm">{post.title}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            {profileUrl[post.post_no] ? (
                                                <img src={profileUrl[post.post_no]} alt="profile" className="w-5 h-5 rounded-full" />
                                            ) : (
                                                <FaUserCircle className="w-5 h-5 text-gray-400" />
                                            )}
                                            <p className="text-xs text-gray-500">{post.name || "익명"}</p>
                                        </div>
                                        <p className="text-gray-500 text-xs mt-1">{post.reg_date}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end min-w-[60px] text-sm space-y-2 mt-3">
                                    <div className="flex items-center text-yellow-500 space-x-1 w-full justify-end">
                                        <FaStar /> <span className="text-gray-500">{post.star}</span>
                                    </div>
                                    <div className="flex items-center text-red-500 space-x-1 w-full justify-end">
                                        <FaHeart /> <span className="text-gray-500">{post.post_like}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
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
