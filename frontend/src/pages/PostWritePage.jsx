import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaArrowLeft, FaPaperPlane } from "react-icons/fa";

// ✅ 태그 데이터
const categories = ["편의점", "서브웨이", "기타"];
const brandsByCategory = {
    편의점: ["GS25", "CU", "세븐일레븐", "이마트24"],
    서브웨이: ["서브웨이"],
    기타: ["GS25", "CU", "세븐일레븐", "이마트24", "서브웨이", "기타"],
};
const taste = ["달콤한 맛", "새콤한 맛", "담백한 맛", "느끼한 맛", "쓴 맛", "매운 맛"]; // ✅ 모든 카테고리 공통
const ingredientsByCategory = {
    편의점: ["음료/주류", "냉동/냉장식품", "신선식품", "디저트", "라면", "스낵류"],
    서브웨이: ["돼지고기/베이컨", "소고기", "닭고기", "에그마요", "새우", "참치", "기타"],
    기타: ["배달음식", "매장음식", "마이레시피"]
};

const PostWritePage = () => {
    const navigate = useNavigate();

    // ✅ 입력 상태 관리
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
    const [showModal, setShowModal] = useState(false);      // 태그 미선택시 알림
    const [notification, setNotification] = useState(""); // 글 작성 알림

    // ✅ 알림 표시 함수
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(""), 2000); // ✅ 2초 후 자동 숨김
    };

    // ✅ 태그 선택 핸들러
    const handleTagSelect = (type, value) => {
        setSelectedTags((prev) => {
            if (type === "category") {
                return {
                    category: value,
                    brand: value === "서브웨이" ? ["서브웨이"] : [],
                    flavors: [],
                    ingredients: [],
                };
            } else if (type === "brand") {
                if (selectedTags.category === "기타") {
                    return {
                        ...prev,
                        brand: prev.brand.includes(value)
                            ? prev.brand.filter((b) => b !== value)
                            : [...prev.brand, value],
                    };
                } else {
                    return { ...prev, brand: prev.brand.includes(value) ? [] : [value] };
                }
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

    // ✅ 글 작성 핸들러 (제목, 내용 필수 + 가격 숫자 체크)
    const handleSubmit = () => {
        const { category, brand, flavors, ingredients } = selectedTags;

        if (!title.trim() || !summary.trim()) {
            setShowModal(true); // 제목 또는 내용이 없으면 모달 표시
            return;
        }

        if (
            !category ||
            (category !== "기타" && brand.length === 0) || // 기타가 아닐 경우 브랜드 필수
            (category === "기타" && brand.length === 0) || // 기타일 경우 브랜드 최소 1개 필수
            flavors.length === 0 ||
            ingredients.length === 0
        ) {
            setShowModal(true); // ✅ 필수 태그 미선택 시 알림 모달 표시
            return;
        }

        // ✅ 가격이 비어있으면 "가격 미측정"으로 설정
        const finalPrice = price.trim() === "" ? "가격 미측정" : price;

        showNotification("글이 작성되었습니다"); // ✅ 댓글 작성 알림과 동일한 위치에 표시
        setTimeout(() => navigate("/"), 500); // ✅ 0.5초 후 홈으로 이동
    };

    // ✅ 가격 숫자 입력 처리
    const handlePriceChange = (e) => {
        const input = e.target.value;
        if (/^\d*$/.test(input)) { // 숫자만 허용
            setPrice(input);
        }
    };


    // ✅ 현재 선택된 카테고리에 따른 브랜드 및 재료 목록 가져오기
    const currentBrands = selectedTags.category ? brandsByCategory[selectedTags.category] : [];
    const currentIngredients =
        selectedTags.category === "기타"
            ? [...ingredientsByCategory["편의점"], ...ingredientsByCategory["서브웨이"], ...ingredientsByCategory["기타"]] // 기타 선택 시 모든 재료 포함
            : selectedTags.category
                ? ingredientsByCategory[selectedTags.category]
                : [];

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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-3 w-full rounded-md shadow-md"
                />

                {/* 내용 입력 */}
                <label className="block text-base font-semibold text-gray-700 mb-1">내용</label>
                <textarea
                    placeholder="내용을 입력해주세요 (최대 200자)"
                    maxLength={200}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="border p-3 w-full rounded-md h-40 shadow-md"
                />

                {/* 가격 입력 (숫자만 입력 가능) */}
                <label className="block text-base font-semibold text-gray-700 mb-1">가격</label>
                <input
                    type="text"
                    placeholder="미입력시 가격 미측정으로 처리"
                    value={price}
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
                    {images.map((image, index) => (
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
                        {categories.map((cat) => (
                            <button key={cat} onClick={() => handleTagSelect("category", cat)}
                                className={`px-3 py-1 rounded-md border ${selectedTags.category === cat ? "bg-green-500 text-white" : "text-gray-500"}`}>
                                {cat}
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
                                    {currentBrands.map((brand) => (
                                        <button key={brand} onClick={() => handleTagSelect("brand", brand)}
                                            className={`px-3 py-1 rounded-md border ${selectedTags.brand.includes(brand) ? "bg-blue-500 text-white" : "text-gray-500"}`}>
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 맛 선택 */}
                            <div>
                                <p className="text-gray-600 text-sm mb-1 font-semibold">맛</p>
                                <div className="flex flex-wrap gap-1">
                                    {taste.map((flavor) => (
                                        <button key={flavor} onClick={() => handleTagSelect("flavors", flavor)}
                                            className={`px-3 py-1 rounded-md border ${selectedTags.flavors.includes(flavor) ? "bg-red-500 text-white" : "text-gray-500"}`}>
                                            {flavor}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 재료 선택 */}
                            <div>
                                <p className="text-gray-600 text-sm mb-1 font-semibold">조합</p>
                                <div className="flex flex-wrap gap-1">
                                    {currentIngredients.map((ingredient) => (
                                        <button key={ingredient} onClick={() => handleTagSelect("ingredients", ingredient)}
                                            className={`px-3 py-1 rounded-md border ${selectedTags.ingredients.includes(ingredient) ? "bg-yellow-500 text-white" : "text-gray-500"}`}>
                                            {ingredient}
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