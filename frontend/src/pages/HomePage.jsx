import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrendingUp } from "react-icons/fi";
import axios from "axios";
import { MyContext } from "../App";



const HomePage = () => {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState({});
    const [recentPosts, setRecentPosts] = useState([]);
    const [hotRankings, setHotRankings] = useState([]);
    const [categoryRankings, setCategoryRankings] = useState({});
    const [tags, setTags] = useState({
        category: [],
        brand: [],
    });
    const { apiURL } = useContext(MyContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiURL}/recent`);
                if (response.data && response.data.length > 0) {
                    console.log(response);
                    setRecentPosts(response.data);

                    // 각 게시물의 썸네일을 가져오는 요청을 병렬 처리
                    const imagePromises = response.data.map(async (data) => {
                        try {
                            if(data.thumbnail==null){return { post_no: data.post_no, imageUrl: null }}
                            const imgResponse = await axios.get(`${apiURL}/view/${data.thumbnail}`, { responseType: "blob" });
                            return { post_no: data.post_no, imageUrl: URL.createObjectURL(imgResponse.data) };
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

                } else {
                    alert("글이 없습니다.");
                    history.back();
                }
            } catch (error) {
                console.error("Error fetching recent posts:", error);
            }
            const hotRanking = await axios.get(`${apiURL}/hotranking`);
            setHotRankings([hotRanking.data[0],hotRanking.data[1],hotRanking.data[2]]);
            console.log("급상승", hotRanking);
            const cateRanking = await axios.get(`${apiURL}/catebest`);
            setCategoryRankings(cateRanking.data);
            console.log("카테랭킹", cateRanking);
            const tag = await axios.post(`${apiURL}/tag`, { category: [0, 1, 2, 3, 4, 5] });
            const sortedCategory = [...tag.data.category].sort((a, b) =>
                a.tag_name === "기타" ? 1 : b.tag_name === "기타" ? -1 : 0
            );

            const sortedBrand = [...tag.data.brand].sort((a, b) =>
                a.tag_name === "기타" ? 1 : b.tag_name === "기타" ? -1 : 0
            );
            setTags({
                category: sortedCategory,
                brand: sortedBrand,
                taste: tag.data.taste,
                ingredient: tag.data.ingredient, // ingredient는 이미 빈 배열
            });

            console.log(categoryRankings, "rr");
            console.log(apiURL);
        };

        fetchData();
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
                            {tags.brand.map((brand) => (
                                <div
                                    key={brand.tag_id}
                                    onClick={() => navigate(`/brands/${brand.tag_id}`)}  // ✅ 브랜드 ID를 URL에 전달
                                    className="bg-green-700 text-white py-1.5 text-center rounded-md text-[15px] cursor-pointer hover:bg-green-800"
                                >
                                    {brand.tag_name}
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
                                key={post.post_no}
                                onClick={() => navigate(`/posts/${post.post_no}`)} // ✅ 해당 글 상세보기로 이동
                                className="border rounded-lg text-center p-2 shadow-md cursor-pointer hover:shadow-lg transition"
                            >
                                <div className="w-full h-20 bg-gray-300 mb-2 flex items-center justify-center rounded">
                                    <span className="text-gray-500 text-sm"><img src={imageUrl[post.post_no]} alt="thumbnail" style={{ height: "80px" }} /></span>
                                </div>
                                <p className="font-medium text-xs text-left">{post.title}</p>
                                <p className="text-gray-500 text-xs text-left">{post.name}</p>
                                <p className="text-gray-600 text-xs text-left font-semibold">{post.cost}</p>
                            </div>
                        ))}
                    </div>
                </div>


                {/* 🔹 카테고리 랭킹 */}
                <div>
                    <h2 className="text-xl font-bold mb-3">카테고리 랭킹 🏆</h2>
                    <div className="p-4 rounded-md border border-gray-200 shadow-md space-y-2">
                        {tags.category.map((cate) => (
                            <div key={cate.tag_id} className="flex justify-between items-center border-b py-2">
                                <div
                                    onClick={() => navigate(`/category/${cate.tag_id}`)}
                                    className="text-base text-green-700 hover:underline cursor-pointer font-semibold"
                                >
                                    {cate.tag_name}
                                </div>
                                {categoryRankings[cate.tag_name] ? (
                                    <div
                                        onClick={() => navigate(`/posts/${categoryRankings[cate.tag_name].post_no}`)}
                                        className="text-gray-600 hover:text-green-600 text-sm cursor-pointer truncate max-w-[150px]"
                                    >
                                        {categoryRankings[cate.tag_name].title.length > 15
                                            ? categoryRankings[cate.tag_name].title.slice(0, 15) + "..."
                                            : categoryRankings[cate.tag_name].title}
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
                        {hotRankings.map((item) => (
                            <div key={item.post_no} className="border-b py-1 text-base">
                                <div
                                    onClick={() => navigate(`/posts/${item.post_no}`)}
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
