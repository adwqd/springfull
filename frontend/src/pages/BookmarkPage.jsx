import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBookmark, FaArrowLeft } from "react-icons/fa"; // ✅ 북마크 아이콘 추가
import axios from "axios";
import Pagination from "../components/Pagination";
import { MyContext } from "../App"; 



const BookmarkPage = () => {
    const navigate = useNavigate();
        const { apiURL } = useContext(MyContext);
        const [userInfo, setUserInfo] = useState(null);
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
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");
        useEffect(() => {
            const storedUserInfo = localStorage.getItem("userInfo");
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo));
              } else {
                navigate("/login"); // ✅ 로그인 안 되어 있으면 로그인 페이지로 이동
            }
        }, [navigate]);

        const fetchPosts = async (page, sort, keyword = "") => {
            setLoading(true);
            try {
                const response = await axios.post(`${apiURL}/member/mybookmark`, {
                    page,
                    size: postsPerPage,
                    keyword: keyword.trim() || "", // 공백 검색 방지
                    sort: parseInt(sort, 10), //  정수 변환 (1: 최신순, 2: 좋아요순, 3: 평점순)
                }, {
                    headers: { Authorization: `Bearer ${token}` },
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
                try {
                    const res = await axios.get(`${apiURL}/token`, {
                        headers: { Authorization: `Bearer ${refreshToken}` },
                    });
    
                    if (!res.data || res.data.length === 0) {
                        alert("다시 로그인 해주세요");
                        localStorage.removeItem("token");
                        localStorage.removeItem("refreshToken");
                        localStorage.removeItem("userInfo");
                        navigate("/login");
                    } else {
                        console.log("새로운 토큰:", res.data);
                        localStorage.setItem("token", res.data.accessToken);
                        localStorage.setItem("refreshToken", res.data.refreshToken);
                        location.reload();
                    }
                } catch (fail) {
                    console.error("토큰 갱신 실패", fail);
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("userInfo");
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
                    fetchPosts(currentPage, sortOption, searchQuery);
                }, [currentPage, sortOption]);
        
            // 검색 기능 (검색 버튼 또는 Enter 키 입력)
            const handleSearchSubmit = () => {
                setCurrentPage(1);
                fetchPosts(1, sortOption, searchQuery);
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
                fetchPosts(1, newSort, searchQuery);
            };

    return (
        <div className="p-4 max-w-lg mx-auto space-y-6">
            {/* 🔹 헤더 & 홈 버튼 */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-center">북마크 🔖</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                    <FaArrowLeft />
                    <span className="text-sm">뒤로 가기</span>
                </button>
            </div>

            {/* 🔽 정렬 옵션 */}
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
                    <option value="3">내 평점순</option>
                </select>
            </div>

            {/* 🔹 북마크한 글 목록 */}
            <div>
                {posts.length > 0 ? (
                    <ul className="space-y-3">
                        {posts.map((post) => (
                            <li
                                key={post.post_no}
                                className="p-3 border rounded-lg flex items-center justify-between transition hover:shadow-md cursor-pointer"
                                onClick={() => navigate(`/posts/${post.post_no}`)} // ✅ 즉시 이동
                            >
                                {/* 🔹 썸네일 (이미지가 있을 때만 표시) */}
                                {post.thumbnail && (
                                    <div className="w-14 h-14 flex-shrink-0">
                                        <img src={imageUrl[post.post_no]} alt="thumbnail" className="w-full h-full object-cover rounded-md" />
                                    </div>
                                )}

                                {/* 🔹 글 정보 */}
                                <div className="flex-1 ml-3">
                                    <p className="block text-gray-800 font-bold mt-1 text-sm">
                                        {post.title.length > 15 ? post.title.slice(0, 15) + "..." : post.title}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        {/* 🔹 작성자 프로필 이미지 */}
                                        <img src={profileUrl[post.post_no]} alt="Profile" className="w-4 h-4 rounded-full" />
                                        <p className="text-gray-600 text-xs">{post.name}</p>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {post.reg_date} {post.mod_date && ` (수정:${post.mod_date})`}
                                    </p>
                                </div>

                                {/* 🔹 북마크 아이콘 */}
                                <div className="text-gray-500 text-sm">
                                    <FaBookmark className="text-yellow-500" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center">북마크한 게시글이 없습니다.</p>
                )}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export default BookmarkPage;
