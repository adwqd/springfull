import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane, FaTrash, FaPlus } from "react-icons/fa";

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
    const navigate = useNavigate();
    const { id } = useParams();

    // ✅ 기존 데이터 불러오기
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [price, setPrice] = useState("");
    const [images, setImages] = useState([]);
    const [selectedTags, setSelectedTags] = useState({
        category: "",
        brand: [],
        flavors: [],
        ingredients: [],
    });
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState("");

    useEffect(() => {
        setTitle(mockPost.title);
        setSummary(mockPost.summary);
        setPrice(mockPost.price);
        setSelectedTags({
            category: mockPost.category || "",
            brand: mockPost.brand || [],
            flavors: mockPost.flavors || [],
            ingredients: mockPost.ingredients || [],
        });
        setImages(mockPost.images || []);
    }, [id]);

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
        setImages((prev) => [...prev, ...newImages]);
    };

    // ✅ 이미지 삭제 핸들러
    const handleRemoveImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
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
        if (/^\d*$/.test(input)) { // 숫자만 입력 가능
            setPrice(input);
        }
    };

    // ✅ 수정 완료 처리
    const handleEditSubmit = () => {
        if (!isFormValid()) {
            setShowModal(true);
            return;
        }

        const updatedPost = {
            id: mockPost.id,
            title,
            summary,
            price,
            category: selectedTags.category,
            brand: selectedTags.brand,
            flavors: selectedTags.flavors,
            ingredients: selectedTags.ingredients,
            images,
            createdAt: mockPost.createdAt,
            updatedAt: new Date().toISOString().split("T")[0],
        };

        console.log("수정된 데이터:", updatedPost);
        showNotification("게시글이 수정되었습니다!");
        setTimeout(() => navigate(`/posts/${id}`), 500);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <button onClick={() => navigate(-1)} className="text-gray-600 flex items-center space-x-2">
                <FaArrowLeft /> <span className="text-sm">뒤로가기</span>
            </button>

            <div className="border p-4 shadow-xl rounded-xl space-y-6 relative">
                <label className="block text-base font-semibold text-gray-700">제목 (최대 20자)</label>
                <input type="text" maxLength={20} value={title} onChange={(e) => setTitle(e.target.value)} className="border p-3 w-full rounded-md shadow-md" />

                <label className="block text-base font-semibold text-gray-700">내용 (최대 200자)</label>
                <textarea maxLength={200} value={summary} onChange={(e) => setSummary(e.target.value)} className="border p-3 w-full rounded-md h-40 shadow-md" />

                <label className="block text-base font-semibold text-gray-700">가격</label>
                <input type="text" value={price} onChange={handlePriceChange} className="border p-3 w-full rounded-md shadow-md" placeholder="숫자만 입력 가능" />

                <label className="block text-base font-semibold text-gray-700">이미지</label>
                <label className="flex items-center justify-center p-3 border border-dashed rounded-md cursor-pointer text-gray-500 hover:bg-gray-100">
                    <FaPlus className="mr-2" />
                    사진 추가 (최대 10개)
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img src={image} alt="preview" className="w-24 h-24 object-cover rounded-md" />
                            <button onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
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
                        {categories.map((cat) => (
                            <button key={cat} onClick={() => handleTagSelect("category", cat)} className={`px-3 py-1 rounded-md border ${selectedTags.category === cat ? "bg-green-500 text-white" : "text-gray-500"}`}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    <p className="text-gray-600 text-sm font-semibold">브랜드</p>
                    <div className="flex flex-wrap gap-1">
                        {currentBrands.map((brand) => (
                            <button key={brand} onClick={() => handleTagSelect("brand", brand)} className={`px-3 py-1 rounded-md border ${selectedTags.brand.includes(brand) ? "bg-blue-500 text-white" : "text-gray-500"}`}>
                                {brand}
                            </button>
                        ))}
                    </div>

                    <p className="text-gray-600 text-sm font-semibold">맛</p>
                    <div className="flex flex-wrap gap-1">
                        {flavors.map((flavor) => (
                            <button key={flavor} onClick={() => handleTagSelect("flavors", flavor)} className={`px-3 py-1 rounded-md border ${selectedTags.flavors.includes(flavor) ? "bg-red-500 text-white" : "text-gray-500"}`}>
                                {flavor}
                            </button>
                        ))}
                    </div>

                    <p className="text-gray-600 text-sm font-semibold">조합</p>
                    <div className="flex flex-wrap gap-1">
                        {currentIngredients.map((ingredient) => (
                            <button key={ingredient} onClick={() => handleTagSelect("ingredients", ingredient)} className={`px-3 py-1 rounded-md border ${selectedTags.ingredients.includes(ingredient) ? "bg-yellow-500 text-white" : "text-gray-500"}`}>
                                {ingredient}
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
