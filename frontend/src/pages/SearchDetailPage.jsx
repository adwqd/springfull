import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaArrowLeft, FaPaperPlane, FaSyncAlt, FaUserCircle, FaStar, FaHeart } from "react-icons/fa";
import axios from "axios";
import Pagination from "../components/Pagination";
import {MyContext} from "../App";


const brands = ["GS25", "CU", "세븐일레븐", "이마트24", "서브웨이", "기타"];
const tastes = ["달콤한 맛", "새콤한 맛", "매운 맛", "쓴 맛", "느끼한 맛"];
const ingredients = ["음료/주류", "냉동/냉장식품", "신선식품", "디저트", "라면", "스낵류", "돼지고기/베이컨", "소고기", "닭고기", "에그마요", "새우", "참치", "배달음식", "매장음식", "마이레시피", "기타"];

const SearchDetailPage = () => {
    const {apiURL} = useContext(MyContext);
    const [userInfo, setUserInfo] = useState(null);
    const [selectedTags, setSelectedTags] = useState({
        category: [0,1,2],
        brand: [],
        taste: [],
        ingredient: [],
    });
    const [tags, setTags] = useState({
        category: [],
        brand: [],
        taste: [],
        ingredient: [],
    });
    const [posts, setPosts] = useState([]);
    const [authors, setAuthors] = useState({});
    const [imageUrl, setImageUrl] = useState({});
    const [profileUrl, setProfileUrl] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false); // ✅ 검색이 실행되었는지 추적하는 상태 추가
    const navigate = useNavigate();

    useEffect(()=>{        
        const fetchData = async () => {
            const response = await axios.post(`${apiURL}/tag`, selectedTags);
            console.log("태그 가져오기", response);
            console.log(response.data);
            const sortedCategory = [...response.data.category].sort((a, b) =>
                a.tag_name === "기타" ? 1 : b.tag_name === "기타" ? -1 : 0
              );
      
              const sortedBrand = [...response.data.brand].sort((a, b) =>
                a.tag_name === "기타" ? 1 : b.tag_name === "기타" ? -1 : 0
              );
              setTags({
                category: sortedCategory,
                brand: sortedBrand,
                taste: response.data.taste,
                ingredient: response.data.ingredient, // ingredient는 이미 빈 배열
              });
        };
        fetchData();
        console.log("태그"+tags);
    }, [selectedTags]);

    // ✅ 태그 선택 핸들러
    const handleTagSelect = (type, value) => {
        setSelectedTags((prev) => ({
            ...prev,
            [type]: prev[type]?.includes(value)
                ? prev[type].filter((item) => item !== value) // ✅ 선택 해제
                : [...prev[type], value], // ✅ 선택 추가
        }));
    };

    const fetchPosts = async (page) => {
        try {
            const response = await axios.post(`${apiURL}/list`, {
                page,
                size: 5,
                brand : selectedTags.brand,
                taste : selectedTags.taste,
                ingredient : selectedTags.ingredient,
                sort: 1
            });
            console.log("aaa",response.data.dtoList);

            if (!response.data || !response.data.dtoList) {
                setSearchResults([]);
                setTotalPages(1);
                return;
            }

            // 🔹 평점 변환: 10점 만점을 5점 만점으로 변환, 없으면 `0.0`
            let postList = response.data.dtoList.map((post) => ({
                ...post,
                post_like: post.post_like ?? 0, // 좋아요 없으면 0
                star: post.star != null ? (post.star).toFixed(1) : "0.0", // 10점 만점을 5점 만점으로 변환
            }));


            setSearchResults(postList);
            setTotalPages(Math.ceil(response.data.total / 5));

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
        }
    };

    // ✅ 검색 실행 핸들러
    const handleSearch = () => {
        setSearchPerformed(true); // ✅ 검색 버튼을 누르면 검색이 실행됨
        fetchPosts(1)
        setCurrentPage(1);
        // ✅ 태그를 선택하지 않으면 모든 게시글을 반환
        
    };

    // ✅ 필터 초기화 함수
    const handleResetFilters = () => {
        setSelectedTags({
            category: [0,1,2],
            brand: [],
            taste: [],
            ingredient: [],
        });
        setSearchResults([]);
        setSearchPerformed(false); // ✅ 검색 상태 초기화
    };

    useEffect(() => {
                fetchPosts(currentPage);
            }, [currentPage]);

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
                        {tags.brand.map((brand) => (
                            <button
                                key={brand.tag_id}
                                onClick={() => handleTagSelect("brand", brand.tag_id)}
                                className={`px-1.5 py-0 text-base rounded-md ${selectedTags.brand.includes(brand.tag_id) ? "bg-green-100 text-gray-500" : "text-gray-500 border"}`}
                            >
                                {brand.tag_name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 맛 태그 선택 */}
                <div className="mt-4 space-y-1.5">
                    <p className="text-sm font-semibold">맛</p>
                    <div className="flex flex-wrap gap-1">
                        {tags.taste.map((taste) => (
                            <button
                                key={taste.tag_id}
                                onClick={() => handleTagSelect("taste", taste.tag_id)}
                                className={`px-2 py-0 text-base rounded-md ${selectedTags.taste.includes(taste.tag_id) ? "bg-green-100 text-gray-500" : "text-gray-500 border"}`}
                            >
                                {taste.tag_name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 조합 태그 선택 */}
                <div className="mt-4 space-y-1.5">
                    <p className="text-sm font-semibold">조합</p>
                    <div className="flex flex-wrap gap-1">
                        {tags.ingredient.map((ingredient) => (
                            <button
                                key={ingredient.tag_id}
                                onClick={() => handleTagSelect("ingredient", ingredient.tag_id)}
                                className={`px-2 py-0 text-base rounded-md ${selectedTags.ingredient.includes(ingredient.tag_id) ? "bg-green-100 text-gray-500" : "text-gray-500 border"}`}
                            >
                                {ingredient.tag_name}
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
                                key={post.post_no}
                                className="border p-3 rounded-lg shadow-md flex items-center hover:shadow-lg transition cursor-pointer"
                                onClick={() => navigate(`/posts/${post.post_no}`)}
                            >
                                {/* 🔹 이미지 (없으면 공백 없이 텍스트 앞으로 이동) */}
                                {post.thumbnail ? (
                                    <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-300">
                                        <img src={imageUrl[post.post_no]} alt="썸네일" className="w-full h-full object-cover" />
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
                                        {profileUrl[post.post_no] ? (
                                            <img
                                                src={profileUrl[post.post_no]}
                                                alt="프로필"
                                                className="w-6 h-6 rounded-full mr-2"
                                            />
                                        ) : (
                                            <FaUserCircle className="w-6 h-6 text-gray-400 mr-2" />
                                        )}
                                        <p className="text-xs text-gray-500">{post.name} • {post.reg_date}</p>
                                    </div>
                                </div>

                                {/* 🔹 좋아요 & 평점 (세로 정렬 & 위치 고정) */}
                                <div className="flex flex-col items-end min-w-[70px] text-sm space-y-1">
                                    <div className="flex items-center text-yellow-500 space-x-1 w-full justify-end">
                                        <FaStar /> <span className="w-6 text-right text-gray-500">{post.star ? Number(post.star).toFixed(1) : "0.0"}</span>
                                    </div>
                                    <div className="flex items-center text-red-500 space-x-1 w-full justify-end">
                                        <FaHeart /> <span className="w-6 text-right text-gray-500">{post.post_like}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                ) : (
                    <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
                )
            ) : null}
        </div>
    );
};

export default SearchDetailPage;
