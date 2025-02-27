import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import {MyContext} from "../App";

// ✅ 태그 데이터

const PostWritePage = () => {
    const [name, setName] = useState("애옹쓰.jpg");
    const {apiURL} = useContext(MyContext);
    const [userInfo, setUserInfo] = useState({
        member_uuid : null
    });
    const navigate = useNavigate();
    const [tags, setTags] = useState({
        category: [],
        brand: [],
        taste: [],
        ingredient: [],
    })

    // ✅ 입력 상태 관리
    const [price, setPrice] = useState("");
    const [images, setImages] = useState([]);
    const [sample, setSample] = useState([]);
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const [selectedTags, setSelectedTags] = useState({
        category: [],
        brand: [],
        taste: [],
        ingredients: [],
    });
    const [post, setPost] = useState({
        post_no : 0,
        title: "",
        content : "",
        cost : 0,
        member_uuid : "aaa",
        image : [],
        brand_id : [],
        taste_id : [],
        ingredient_id : []
    })
    const [showModal, setShowModal] = useState(false);      // 태그 미선택시 알림
    const [notification, setNotification] = useState(""); // 글 작성 알림

    // ✅ 알림 표시 함수
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(""), 2000); // ✅ 2초 후 자동 숨김
    };
    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("토큰:", token);
                const response = await axios.get(`${apiURL}/member/check`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                console.log("응답 데이터:", response.data);
                if (response.status === 200) {
                    console.log("로그인 성공");
                }
            } catch (error) {
                console.error("요청 실패. 토큰 갱신 시도", error);
                try {
                    const res = await axios.get("http://192.168.4.10:8081/token", {
                        headers: { Authorization: `Bearer ${refreshToken}` },
                    });
    
                    if (!res.data || res.data.length === 0) {
                        alert("다시 로그인 해주세요");
                        localStorage.removeItem("token");
                        localStorage.removeItem("refreshToken");
                        localStorage.removeItem("userInfo");
                        location.href = "/";
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
                    location.href = "/";
                }
            }
        };
    
        checkAuth();
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
          } else {
            navigate("/login"); // ✅ 로그인 안 되어 있으면 로그인 페이지로 이동
        }
    }, []);

    useEffect(()=>{
        setPost({...post, member_uuid : userInfo.member_uuid})
    }, [userInfo])

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
        setPost({
            ...post,
            brand_id : selectedTags.brand,
            taste_id : selectedTags.taste,
            ingredient_id : selectedTags.ingredients
        });
        console.log("포스트상태",post);
    }, [selectedTags]);

    // ✅ 태그 선택 핸들러
    const handleTagSelect = (type, tag_id) => {
        setSelectedTags((prev) => {
            if (type === "category") {
                return {
                    category: [tag_id], // 단일 값으로 저장
                    brand: tag_id === 2 ? [tag_id] : [], // 예제: 서브웨이는 고정 브랜드
                    taste: [],
                    ingredients: [],
                };
            } else if (type === "brand") {
                return {
                    ...prev,
                    brand: prev.brand.includes(tag_id)
                        ? prev.brand.filter((b) => b !== tag_id)
                        : [...prev.brand, tag_id],
                };
            } else {
                return {
                    ...prev,
                    [type]: prev[type].includes(tag_id)
                        ? prev[type].filter((item) => item !== tag_id)
                        : [...prev[type], tag_id],
                };
            }
        });
    };

    // ✅ 이미지 추가 핸들러 (최대 10개)
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        if (images.length + files.length > 10) {
            alert("최대 10개의 이미지만 업로드할 수 있습니다.");
            return;
        }
        const newImages = files.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...files]);
        setSample((prev) => [...prev, ...newImages]);
    };

    // ✅ 이미지 삭제 핸들러
    const handleRemoveImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setSample((prev) => prev.filter((_, i) => i !== index));
    };

    // ✅ 글 작성 핸들러 (제목, 내용 필수 + 가격 숫자 체크)
    const handleSubmit = () => {
        const { category, brand, taste, ingredients } = selectedTags;
        console.log("태그들",category, brand, taste, ingredients)

        if (!post.title.trim() || !post.content.trim()) {
            setShowModal(true); // 제목 또는 내용이 없으면 모달 표시
            return;
        }

        if (
            !category ||
            (!category.includes(0) && brand.length === 0) || // 기타가 아닐 경우 브랜드 필수
            (category.includes(0) && brand.length === 0) || // 기타일 경우 브랜드 최소 1개 필수
            taste.length === 0 ||
            ingredients.length === 0
        ) {
            setShowModal(true); // ✅ 필수 태그 미선택 시 알림 모달 표시
            return;
        }

        const register = async () => {
            try {
                // 이미지 업로드
                const formData = new FormData();
                for(let file of images){
                formData.append("files", file);
                }
        
                const uploadResponse = await axios.post(`${apiURL}/member/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                     },
                    
                });
                console.log("이미지 업로드 응답", uploadResponse);
                console.log(uploadResponse.data[0].link);
        
                // 상태 업데이트 후 글 작성
                setName(uploadResponse.data[0].link);
                setPost((prevPost) => {
                    const updatedPost = { ...prevPost, image: uploadResponse.data };
                    // 글 작성 요청을 setPost가 완료된 후 실행
                    axios.post(`${apiURL}/member/register`, updatedPost, {
                        headers: { "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                         }
                    })
                    .then((postResponse) => {
                        console.log("글작성 응답", postResponse);
                        console.log(postResponse.data);
                    })
                    .catch((error) => {
                        console.error("글 작성 중 오류 발생", error);
                    });
                    return updatedPost;
                });
        
            } catch (error) {
                console.error("업로드나 글작성 중 오류 발생", error);
            }
        };
        register();
        showNotification("글이 작성되었습니다"); // ✅ 댓글 작성 알림과 동일한 위치에 표시
        setTimeout(() => navigate("/"), 500); // ✅ 0.5초 후 홈으로 이동
    };

    // ✅ 가격 숫자 입력 처리
    const handlePriceChange = (e) => {
        const input = e.target.value;
        if (/^\d*$/.test(input)) { // 숫자만 허용
            setPrice(input);
            setPost({...post, cost : e.target.value});
        }
    };


    // ✅ 현재 선택된 카테고리에 따른 브랜드 및 재료 목록 가져오기
    // const currentBrands = selectedTags.category ? brandsByCategory[selectedTags.category] : [];
    // const currentIngredients =
    //     selectedTags.category === "기타"
    //         ? [...ingredientsByCategory["편의점"], ...ingredientsByCategory["서브웨이"], ...ingredientsByCategory["기타"]] // 기타 선택 시 모든 재료 포함
    //         : selectedTags.category
    //             ? ingredientsByCategory[selectedTags.category]
    //             : [];

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* 🔙 뒤로가기 버튼 */}
            <button onClick={() => navigate(-1)} className="text-gray-600 flex items-center space-x-2">
                <FaArrowLeft /> <span className="text-sm">뒤로가기</span>
            </button>

            {/* 📝 글 작성 카드 */}
            <div className="border p-4 shadow-xl rounded-xl space-y-6 relative">

                {/* 제목 입력 */}
                <label className="block text-base font-semibold text-gray-700 mb-1">제목</label>
                <input
                    type="text"
                    placeholder="제목을 입력해주세요 (최대 20자)"
                    maxLength={20}
                    value={post.title}
                    onChange={(e) => setPost({...post, title:e.target.value})}
                    className="border p-3 w-full rounded-md shadow-md"
                />

                {/* 내용 입력 */}
                <label className="block text-base font-semibold text-gray-700 mb-1">내용</label>
                <textarea
                    placeholder="내용을 입력해주세요 (최대 200자)"
                    maxLength={200}
                    value={post.content}
                    onChange={(e) => setPost({...post, content:e.target.value})}
                    className="border p-3 w-full rounded-md h-40 shadow-md"
                />

                {/* 가격 입력 (숫자만 입력 가능) */}
                <label className="block text-base font-semibold text-gray-700 mb-1">가격</label>
                <input
                    type="number"
                    placeholder="미입력시 가격 미측정으로 처리"
                    value={post.cost}
                    onChange={handlePriceChange} // ✅ 숫자만 입력 가능
                    className="border p-3 w-full rounded-md shadow-md"
                />


                {/* 🖼 이미지 업로드 */}

                <label className="flex items-center justify-center p-3 border border-dashed rounded-md cursor-pointer text-gray-500 hover:bg-gray-100">
                    <FaPlus className="mr-2" />
                    사진 추가 (최대 10개)
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>

                {/* ✅ 선택한 이미지 개수 표시 */}
                <p className="text-sm text-gray-500">{images.length}/10</p>

                {/* ✅ 이미지 미리보기 */}
                <div className="grid grid-cols-5 gap-2">
                    {sample.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image}
                                alt="preview"
                                className="w-20 h-20 object-cover rounded-md"
                            />
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))}
                </div>
                {/* 카테고리 선택 */}
                <label className="block text-base font-semibold text-gray-700 mb-1">태그
                    <label className="block text-xs  text-gray-400">(각 최소 1개의 태그를 선택해주세요)</label>
                </label>

                <div className="border p-4 rounded-md space-y-5 relative shadow-md">
                    <p className="text-gray-600 text-sm mb-1 font-semibold">카테고리</p>
                    <div className="flex flex-wrap gap-1">
                        {tags.category.map((cat) => (
                            <button key={cat.tag_id} onClick={() => handleTagSelect("category", cat.tag_id)}
                                className={`px-3 py-1 rounded-md border ${selectedTags.category.includes(cat.tag_id) ? "bg-green-500 text-white" : "text-gray-500"}`}>
                                {cat.tag_name}
                            </button>
                        ))}
                    </div>



                    {/* 카테고리를 선택한 경우 브랜드, 맛, 재료 표시 */}
                    {selectedTags.category && (
                        <>
                            {/* 브랜드 선택 */}
                            <div>
                                <p className="text-gray-600 text-sm mb-1 font-semibold">브랜드</p>
                                <div className="flex flex-wrap gap-1">
                                    {tags.brand.map((brand) => (
                                        <button key={brand.tag_id} onClick={() => handleTagSelect("brand", brand.tag_id)}
                                            className={`px-3 py-1 rounded-md border ${selectedTags.brand.includes(brand.tag_id) ? "bg-blue-500 text-white" : "text-gray-500"}`}>
                                            {brand.tag_name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 맛 선택 */}
                            <div>
                                <p className="text-gray-600 text-sm mb-1 font-semibold">맛</p>
                                <div className="flex flex-wrap gap-1">
                                    {tags.taste.map((taste) => (
                                        <button key={taste.tag_id} onClick={() => handleTagSelect("taste", taste.tag_id)}
                                            className={`px-3 py-1 rounded-md border ${selectedTags.taste.includes(taste.tag_id) ? "bg-red-500 text-white" : "text-gray-500"}`}>
                                            {taste.tag_name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 재료 선택 */}
                            <div>
                                <p className="text-gray-600 text-sm mb-1 font-semibold">조합</p>
                                <div className="flex flex-wrap gap-1">
                                    {tags.ingredient.map((ingredient) => (
                                        <button key={ingredient.tag_id} onClick={() => handleTagSelect("ingredients", ingredient.tag_id)}
                                            className={`px-3 py-1 rounded-md border ${selectedTags.ingredients.includes(ingredient.tag_id) ? "bg-yellow-500 text-white" : "text-gray-500"}`}>
                                            {ingredient.tag_name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}


                </div>
            </div>
            {/* ✅ 작성 버튼을 태그 선택창 아래에 "고정" */}
            <div className="sticky bottom-0 right-0 flex justify-end p-3">
                <button
                    onClick={handleSubmit}
                    className="px-5 py-2 text-gray-700 border rounded-md flex items-center space-x-2 shadow-md 
                   hover:bg-green-600 focus:bg-green-600 focus:ring-2 focus:ring-green-600 transition-all duration-200 hover:text-white focus:text-white"
                >
                    <FaPaperPlane />
                    <span>작성</span>
                </button>
            </div>



            {/* 글 작성 시 알림 메시지 표시 */}
            {notification && (
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-600 px-2 py-2 rounded-md shadow-md z-50 text-sm">
                    {notification}
                </div>
            )}

            {/* 항목 미작성시 알림 모달 */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-base font-bold text-red-500">⚠️ 필수 입력 항목 누락</p>
                        <p className="text-gray-400 mt-2 text-sm">(제목, 내용, 태그 모두 필수 항목)</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 px-3 py-1 bg-gray-500 text-white rounded-md text-sm"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}



        </div>
    );
};

export default PostWritePage; 