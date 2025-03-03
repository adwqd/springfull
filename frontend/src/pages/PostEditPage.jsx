import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import {MyContext} from "../App";

// ✅ 기존 게시글 데이터 (API 연동 전까지 사용)
const mockPost = {
    id: 1,
    title: "서브웨이 우즈정식",
    summary: "쉬림프 샌드위치에 에그마요와 베이컨 추가",
    price: "11000",
    category: "서브웨이",
    brand: ["서브웨이"],
    flavors: ["매운 맛", "달콤한 맛"],
    ingredients: ["새우", "에그마요"],
    images: ["https://source.unsplash.com/400x300/?food"],
    createdAt: "2025/01/03",
    updatedAt: null,
};

// ✅ 태그 데이터
const categories = ["편의점", "서브웨이", "기타"];
const brandsByCategory = {
    편의점: ["GS25", "CU", "세븐일레븐", "이마트24"],
    서브웨이: ["서브웨이"],
    기타: ["GS25", "CU", "세븐일레븐", "이마트24", "서브웨이", "기타"],
};
const flavors = ["달콤한 맛", "새콤한 맛", "담백한 맛", "느끼한 맛", "쓴 맛", "매운 맛"];
const ingredientsByCategory = {
    편의점: ["음료/주류", "냉동/냉장식품", "신선식품", "디저트", "라면", "스낵류"],
    서브웨이: ["돼지고기/베이컨", "소고기", "닭고기", "에그마요", "새우", "참치", "기타"],
    기타: ["배달음식", "매장음식", "마이레시피"]
};

const PostEditPage = () => {
    const { id } = useParams();

    // ✅ 기존 데이터 불러오기
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
                console.log("요청 실패. 토큰 갱신 시도", error);
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

    useEffect(() => {
        const getPost = async () =>{
            const response = await axios.get(`${apiURL}/read?post_no=${id}&member_uuid=${userInfo.member_uuid}`);
            setPost(response.data);
            console.log("글읽기", response.data);
            setSelectedTags({
                category : response.data.cate_id,
                brand : response.data.brand_id,
                taste : response.data.taste_id,
                ingredients : response.data.ingredient_id
            });
            if(response.data.member_uuid != JSON.parse(localStorage.getItem("userInfo")).member_uuid){
                alert("본인 글만 수정할수 있습니다.");
                history.back();
                }
            const images = response.data.image;
            const imageRequests = images.map(async (image) => {
                try {
                    if(image ==null){return null;}
                    const filename = image.img_uuid + "_" + image.filename;
                    const imgResponse = await axios.get(`http://localhost:8081/view/${filename}`, { responseType: "blob" });
                    return URL.createObjectURL(imgResponse.data);
                } catch (error) {
                    console.error("Error fetching image:", error);
                    return null;
                }
            });

            const imageUrls = await Promise.all(imageRequests);
            setSample(imageUrls);
            setImages(imageUrls);
        }
        getPost();
    }, [id]);

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

    // ✅ 알림 표시 함수
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(""), 2000);
    };

    // ✅ 태그 선택 핸들러 (수정 가능, 카테고리 변경 시 초기화)
    const handleTagSelect = (type, value) => {
        setSelectedTags((prev) => {
            if (type === "category") {
                return { category: value, brand: [], flavors: [], ingredients: [] };
            } else {
                return {
                    ...prev,
                    [type]: prev[type].includes(value)
                        ? prev[type].filter((item) => item !== value)
                        : [...prev[type], value],
                };
            }
        });
    };

    // ✅ 현재 선택된 카테고리에 따른 브랜드 및 재료 목록 가져오기
    const currentBrands = selectedTags.category ? brandsByCategory[selectedTags.category] : [];
    const currentIngredients =
        selectedTags.category === "기타"
            ? [...ingredientsByCategory["편의점"], ...ingredientsByCategory["서브웨이"], ...ingredientsByCategory["기타"]]
            : ingredientsByCategory[selectedTags.category] || [];

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

    // ✅ 필수 입력 항목 검증 (조합 태그 필수 선택 검증 추가)
    const isFormValid = () => {
        return (
            title.trim() !== "" &&
            summary.trim() !== "" &&
            price.trim() !== "" &&
            selectedTags.category !== "" &&
            selectedTags.brand.length > 0 &&
            selectedTags.flavors.length > 0 &&
            Array.isArray(selectedTags.ingredients) && selectedTags.ingredients.length > 0 // 🔥 조합 태그 필수 선택 검증 강화
        );
    };

    // ✅ 가격 숫자 입력만 허용
    const handlePriceChange = (e) => {
        const input = e.target.value;
        if (/^\d*$/.test(input)) { // 숫자만 허용
            setPrice(input);
            setPost({...post, cost : e.target.value});
        }
    };

    // ✅ 수정 완료 처리
    const handleEditSubmit = () => {
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
                if(images == null || images.length == 0){
                    console.log("이미지가 없습니다", images.length);
                    axios.post(`${apiURL}/member/register`, post, {
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
                }
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
                    axios.put(`${apiURL}/member/post`, updatedPost, {
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
        showNotification("글이 수정되었습니다"); // ✅ 댓글 작성 알림과 동일한 위치에 표시
        setTimeout(() => navigate("/"), 500); // ✅ 0.5초 후 홈으로 이동
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <button onClick={() => navigate(-1)} className="text-gray-600 flex items-center space-x-2">
                <FaArrowLeft /> <span className="text-sm">뒤로가기</span>
            </button>

            <div className="border p-4 shadow-xl rounded-xl space-y-6 relative">
                <label className="block text-base font-semibold text-gray-700">제목 (최대 20자)</label>
                <input type="text" maxLength={20} value={post.title} onChange={(e) => setPost({...post, title:e.target.value})} className="border p-3 w-full rounded-md shadow-md" />

                <label className="block text-base font-semibold text-gray-700">내용 (최대 200자)</label>
                <textarea maxLength={200} value={post.content}  onChange={(e) => setPost({...post, content:e.target.value})} className="border p-3 w-full rounded-md h-40 shadow-md" />

                <label className="block text-base font-semibold text-gray-700">가격</label>
                <input type="number" value={post.cost} onChange={handlePriceChange} className="border p-3 w-full rounded-md shadow-md" placeholder="숫자만 입력 가능" />

                <label className="block text-base font-semibold text-gray-700">이미지</label>
                <label className="flex items-center justify-center p-3 border border-dashed rounded-md cursor-pointer text-gray-500 hover:bg-gray-100">
                    <FaPlus className="mr-2" />
                    사진 추가 (최대 10개)
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
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
                <p className="text-sm text-gray-500">{images.length}/10</p>


                {/* ✅ 태그 수정 가능 */}
                <label className="block text-base font-semibold text-gray-700">태그</label>
                <div className="border p-4 rounded-md space-y-5 shadow-md">
                    <p className="text-gray-600 text-sm font-semibold">카테고리</p>
                    <div className="flex flex-wrap gap-1">
                        {tags.category.map((cat) => (
                            <button key={cat.tag_id} onClick={() => handleTagSelect("category", cat.tag_id)}
                                className={`px-3 py-1 rounded-md border ${selectedTags.category.includes(cat.tag_id) ? "bg-green-500 text-white" : "text-gray-500"}`}>
                                {cat.tag_name}
                            </button>
                        ))}
                    </div>

                    <p className="text-gray-600 text-sm font-semibold">브랜드</p>
                    <div className="flex flex-wrap gap-1">
                        {tags.brand.map((brand) => (
                            <button key={brand.tag_id} onClick={() => handleTagSelect("brand", brand.tag_id)}
                                 className={`px-3 py-1 rounded-md border ${selectedTags.brand.includes(brand.tag_id) ? "bg-blue-500 text-white" : "text-gray-500"}`}>
                                {brand.tag_name}
                            </button>
                        ))}
                    </div>

                    <p className="text-gray-600 text-sm font-semibold">맛</p>
                    <div className="flex flex-wrap gap-1">
                    {tags.taste.map((taste) => (
                        <button key={taste.tag_id} onClick={() => handleTagSelect("taste", taste.tag_id)}
                             className={`px-3 py-1 rounded-md border ${selectedTags.taste.includes(taste.tag_id) ? "bg-red-500 text-white" : "text-gray-500"}`}>
                           {taste.tag_name}
                        </button>
                    ))}
                    </div>

                    <p className="text-gray-600 text-sm font-semibold">조합</p>
                    <div className="flex flex-wrap gap-1">
                        {tags.ingredient.map((ingredient) => (
                            <button key={ingredient.tag_id} onClick={() => handleTagSelect("ingredients", ingredient.tag_id)}
                                 className={`px-3 py-1 rounded-md border ${selectedTags.ingredients.includes(ingredient.tag_id) ? "bg-yellow-500 text-white" : "text-gray-500"}`}>
                                {ingredient.tag_name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button onClick={handleEditSubmit} className="px-5 py-2 bg-green-600 text-white rounded-md shadow-md">
                <FaPaperPlane />
            </button>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-base font-bold text-red-500">⚠️ 필수 입력 항목 누락</p>
                        <button onClick={() => setShowModal(false)} className="mt-4 px-3 py-1 bg-gray-500 text-white rounded-md text-sm">확인</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PostEditPage;
