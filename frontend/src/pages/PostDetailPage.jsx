import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaPaperPlane, FaArrowLeft } from "react-icons/fa";

//더미 데이터
const mockPost = {
    id: 1,
    category: "subway",
    brand: "서브웨이",
    title: "서브웨이 우즈정식",
    price: "11,000원",
    image: "https://source.unsplash.com/400x300/?food", // 이미지가 있을 때만 표시
    description: `쉬림프 샌드위치에 에그마요와 베이컨 추가  
    * 필수 재료: 쉬림프 패티, 올리브, 피클, 레터스  
    * 추가 재료: 에그마요, 베이컨  
      
    하임즈 재료는 취향껏 넣으시면 됨! 추가할수록 소스가 찐!
    하임즈 재료는 취향껏 넣으시면 됨! 추가할수록 소스가 찐!
    하임즈 재료는 취향껏 넣으시면 됨! 추가할수록 소스가 찐!
    하임즈 재료는 취향껏 넣으시면 됨! 추가할수록 소스가 찐!`,
    ingredients: ["달콤한 맛", "매운 맛"],
    tags: ["에그마요", "쉬림프"],
    rating: 4.5,
    likes: 42,
    bookmarked: false,
    createdAt: "2025/01/03",
    updatedAt: "2025/01/05",
    writer: {
        name: "user123",
        profileImg: "https://source.unsplash.com/50x50/?profile",
    },
    comments: [
        { id: 1, writer: "reviewer name", content: "테이크아웃 소스랑 같이 먹어야 완전 꿀조합!", date: "2025/01/03", likes: 3, liked: false },
        { id: 2, writer: "reviewer name", content: "다진 피클이랑 소스를 왕창 추가하니 꿀맛!", date: "2025/01/02", likes: 2, liked: false },
    ],
};

// 브랜드별 라벨 배경색 지정
const brandColors = {
    "서브웨이": "bg-green-600 text-white",
    "GS25": "bg-blue-600 text-white",
    "CU": "bg-purple-600 text-white",
    "이마트24": "bg-yellow-500 text-white",
    "세븐일레븐": "bg-red-600 text-white",
    "기타": "bg-gray-600 text-white",
};

const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(mockPost);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [rating, setRating] = useState(post.rating);
    const [bookmarked, setBookmarked] = useState(post.bookmarked);

    // 게시글 작성/수정/삭제/신고 상태
    const [postModalOpen, setPostModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    // 댓글 작성/수정/삭제 상태
    const [comments, setComments] = useState(post.comments);
    const [commentModalOpen, setCommentModalOpen] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState("");
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [newComment, setNewComment] = useState("");

    //상태 완료 알림
    const [notification, setNotification] = useState("");



    // 백엔드 API 호출 자리 (현재는 더미 데이터 사용)
    useEffect(() => {
        // ⚠️ 실제 API 요청 예시
        // axios.get(`/api/posts/${id}`).then(response => {
        //     setPost(response.data);
        // }).catch(error => console.error(error));
    }, [id]);

    //상태 알림 기능 2초 후에 사라짐
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(""), 2000);
    };

    //게시글 -----------------------------------------------------------------------------------------------------------------------------------------------
    // 게시글 좋아요 
    const handleLike = () => {
        setLiked((prevLiked) => !prevLiked); // 상태만 업데이트

        setLikeCount((prevCount) =>
            liked ? prevCount - 1 : prevCount + 1 // 최신 liked 값을 직접 사용
        );

        showNotification(liked ? "게시글 좋아요를 취소했습니다." : "게시글에 좋아요를 남겼습니다");
    };


    // 별점 추가
    const handleRating = (newRating) => {
        setRating(newRating);
        showNotification(`게시글에 ${newRating}점 평점을 남겼습니다`);
    };

    // 북마크 토글
    const handleBookmark = () => {
        setBookmarked(!bookmarked);
        showNotification(bookmarked ? "게시글 북마크를 취소했습니다." : "게시글을 북마크했습니다");
    };

    // 게시글 모달 토글
    const togglePostModal = (e) => {
        e.stopPropagation();
        setPostModalOpen(!postModalOpen);
    };

    // 게시글 신고 모달 토글
    const toggleReportModal = () => {
        setReportModalOpen(!reportModalOpen);
        setPostModalOpen(false); // 신고 모달 열면 기존 모달 닫기
    };

    // 게시글  신고 제출 처리
    const handleReportSubmit = () => {
        if (!selectedReason) {
            alert("신고 사유를 선택해주세요.");
            return;
        }

        const reportDetails = selectedReason === "기타" ? customReason : selectedReason;
        if (!reportDetails.trim()) {
            alert("신고 내용을 입력해주세요.");
            return;
        }

        console.log("신고 접수 완료:", reportDetails);
        alert("신고가 접수되었습니다.");
        setReportModalOpen(false);
        setSelectedReason("");
        setCustomReason("");
    };

    // 게시글 삭제 모달 토글
    const toggleDeleteModal = () => {
        setDeleteModalOpen(!deleteModalOpen);
        setPostModalOpen(false);
    };

    // 게시글 삭제 처리
    const handleDeletePost = async () => {
        try {
            console.log(`🚮 게시글 삭제 요청: ${post.id}`);
            // TODO: 실제 삭제 API 호출 자리 (백엔드 연동 필요)
            // const response = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });

            // if (!response.ok) throw new Error("삭제 실패");

            alert("✅ 게시글이 삭제되었습니다.");
            navigate("/users/me"); // 삭제 후 마이페이지로 이동
        } catch (error) {
            console.error("게시글 삭제 오류:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    //댓글 ------------------------------------------------------------------------------------------------------------------------------------------
    // 댓글 좋아요 토글 (색상 변경 & 숫자 업데이트)
    const handleCommentLike = (commentId) => {
        setComments((prevComments) => {
            return prevComments.map((comment) => {
                if (comment.id === commentId) {
                    const updatedLiked = !comment.liked; // 새로운 liked 상태 저장
                    showNotification(updatedLiked ? "댓글에 좋아요를 남겼습니다" : "댓글 좋아요를 취소했습니다."); // 최신 liked 값 기반으로 알림 표시
                    return { ...comment, liked: updatedLiked, likes: updatedLiked ? comment.likes + 1 : comment.likes - 1 };
                }
                return comment;
            });
        });
    };

    //댓글 모달창
    const toggleCommentModal = (event, commentId) => {
        event?.stopPropagation();
        setCommentModalOpen(commentModalOpen === commentId ? null : commentId);
    };
    //댓글 수정 입력창
    const handleEditComment = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditCommentContent(content);
        setCommentModalOpen(null);
    };
    // ✅ 댓글 수정 저장 (Enter 키 적용)
    const handleSaveEditComment = (commentId) => {
        if (editCommentContent.trim() === "") return;
        setComments((prev) =>
            prev.map((comment) =>
                comment.id === commentId ? { ...comment, content: editCommentContent } : comment
            )
        );
        setEditingCommentId(null);
        showNotification("댓글이 수정되었습니다.");
    };

    // ✅ 엔터키로 댓글 저장
    const handleEditKeyDown = (e, commentId) => {
        if (e.key === "Enter" && !e.shiftKey) {  // Shift + Enter 입력 시 줄바꿈
            e.preventDefault();
            handleSaveEditComment(commentId);
        }
    };

    const handleDeleteComment = () => {
        if (deleteCommentId !== null) {
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== deleteCommentId));
            setDeleteCommentId(null);
            showNotification("댓글이 삭제되었습니다.");
        }
    };


    //댓글 작성
    const handleAddComment = () => {
        if (newComment.trim() === "") return;
        const newCommentObj = {
            id: comments.length + 1,
            writer: "현재 사용자",
            profileImg: "https://source.unsplash.com/40x40/?profile", // 더미 프로필 이미지 추가
            content: newComment,
            date: formatDate(new Date()),
            likes: 0,
            liked: false,
        };
        setComments([...comments, newCommentObj]);
        setNewComment(""); // 입력창 초기화
        showNotification("댓글이 작성되었습니다.");
    };


    //---------------------------------------------------------------------------------------------------------------------------------------------------------------
    // 모달창 다른 곳 클릭하면 모달 닫기
    useEffect(() => {
        const closeModals = (e) => {
            if (!e.target.closest(".modal")) {
                setPostModalOpen(false);
                setCommentModalOpen(null);
            }
        };
        document.addEventListener("click", closeModals);
        return () => document.removeEventListener("click", closeModals);
    }, []);

    // 날짜 `YYYY/MM/DD` 포맷
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}/${month}/${day}`;
    };



    return (

        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {notification && (
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-600 px-2 py-2 rounded-md shadow-md z-50 text-sm">
                    {notification}
                </div>
            )}
            {/* 🔙 뒤로가기 버튼 */}
            <button onClick={() => navigate(-1)} className="text-gray-600 flex items-center space-x-2 ">
                <FaArrowLeft /> <span className="text-sm">뒤로가기</span>
            </button>

            <div className="border p-4 shadow-md rounded-xl space-y-10 relative">
                {/* ✅ 브랜드 라벨 (카드 내부 상단 오른쪽 고정) */}
                <div className={`absolute top-4 right-4 px-4 py-1 text-sm font-semibold rounded-md ${brandColors[post.brand] || "bg-gray-600 text-white"}`}>
                    {post.brand}
                </div>



                {/* 🔹 이미지 ( 이미지 없으면 숨김) */}
                {post.image && (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                        <img src={post.image} alt="게시글 이미지" className="w-full h-full object-cover rounded-md" />
                    </div>
                )}
                {/* 🔹 게시글 헤더 */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">{post.title} ({post.price})</h2>
                    <button onClick={togglePostModal} className="text-gray-600 text-lg modal">⋮</button>
                </div>

                {/* 🔹 작성자 정보 */}
                <div className="flex items-center space-x-3 border-b pb-2 border-gray-200">
                    <img src={post.writer.profileImg} alt="프로필" className="w-6 h-6 rounded-full" />
                    <div>
                        <p className="text-xs font-semibold">{post.writer.name}</p>
                        <p className="text-xs text-gray-500">{post.createdAt}</p>

                    </div>
                </div>

                {/* 🔹 게시글 모달 */}
                {postModalOpen && (
                    <div className="absolute top-12 right-4 bg-white border rounded-md shadow-lg p-2 w-40 modal z-50">
                        <ul className="space-y-2 text-gray-700">
                            <li className="cursor-pointer hover:bg-gray-100 p-2" onClick={() => navigate(`/posts/${post.id}/edit`)}>수정</li>
                            <li className="cursor-pointer hover:bg-gray-100 p-2" onClick={toggleDeleteModal}>삭제</li>
                            <li className="cursor-pointer hover:bg-gray-100 p-2" onClick={toggleReportModal}>신고</li>
                        </ul>
                    </div>
                )}

                {/* 🔹 게시글 내용 */}

                <pre className="whitespace-pre-wrap text-gray-700 text-sm">{post.description}</pre>
            </div>

            <div className="border p-3 shadow-md rounded-xl space-y-0">
                {/* 🔹 좋아요 & 별점 & 북마크 */}
                <div className="flex justify-between items-center pt-1  ">

                    {/* ⭐ 별점 조절 가능 */}
                    <div className="flex space-x-1 text-gray-600 text-sm">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onClick={() => handleRating(star)}>
                                {star <= rating ? "⭐" : "☆"}
                            </button>
                        ))}
                        <span>{rating.toFixed(1)}</span>
                    </div>

                    {/* 🔹 좋아요 & 북마크 */}
                    <div className="flex justify-end space-x-3 text-sm">
                        <button onClick={handleLike} className={`flex items-center space-x-1 ${liked ? "text-red-500" : "text-gray-500"}`}>
                            {liked ? <FaHeart /> : <FaRegHeart />} <span>{likeCount}</span>
                        </button>

                        <button onClick={handleBookmark} className="flex items-center space-x-1 text-yellow-500">
                            {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                        </button>
                    </div>
                </div>

                {/* 🔹 태그 표시 */}
                <div className="p-3 rounded-xl">
                    {/* 🔹 맛 태그 (빨간색) + 재료 태그 (노란색) → 한 줄에 표시 */}
                    <div className="flex flex-nowrap gap-2 overflow-x-auto items-center mt-2">
                        {post.ingredients.map((ingredient, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-md whitespace-nowrap">
                                # {ingredient}
                            </span>
                        ))}
                        {post.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-md whitespace-nowrap">
                                # {tag}
                            </span>
                        ))}

                    </div>
                </div>

                {/* 🔹게시글 신고 모달 */}
                {reportModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-5 rounded-lg shadow-md w-80">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">신고 사유 선택</h3>

                            {/* 사유 선택 드롭다운 */}
                            <select
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="border px-3 py-2 w-full rounded-md mb-4"
                            >
                                <option value="">사유 선택</option>
                                <option value="부적절한 내용">부적절한 내용</option>
                                <option value="허위 정보">허위 정보</option>
                                <option value="스팸 또는 광고">스팸 또는 광고</option>
                                <option value="기타">기타</option>
                            </select>

                            {/* 기타 사유 입력 필드 (기타 선택 시 활성화) */}
                            {selectedReason === "기타" && (
                                <textarea
                                    className="w-full border p-2 rounded-md text-sm mb-4"
                                    placeholder="신고 사유를 입력하세요..."
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                />
                            )}

                            {/* 신고 제출 & 취소 버튼 */}
                            <div className="flex justify-end space-x-3">
                                <button onClick={() => setReportModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md">취소</button>
                                <button onClick={handleReportSubmit} className="bg-red-500 text-white px-4 py-2 rounded-md">신고</button>
                            </div>
                        </div>
                    </div>
                )}
                {/* 🔹게시글 삭제 확인 모달 */}
                {deleteModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-5 rounded-lg shadow-md w-80">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">게시글 삭제</h3>
                            <p className="text-gray-600 text-sm mb-4">해당 게시글을 삭제하시겠습니까?</p>
                            <div className="flex justify-end space-x-3">
                                <button onClick={() => setDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md">취소</button>
                                <button onClick={handleDeletePost} className="bg-red-500 text-white px-4 py-2 rounded-md">삭제</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <div className="max-w-2xl mx-auto p-0 space-y-6 shadow-md" >
                {/* 🔹 댓글 목록 */}
                <div className="border p-3 shadow-md rounded-xl">
                    <h3 className="text-base font-bold text-gray-800">댓글</h3>

                    {comments.map((comment) => (
                        <div key={comment.id} className="mt-3 border p-3 rounded-md shadow-sm relative text-sm">

                            {/* 작성자 정보*/}
                            <div className="flex items-center space-x-2">
                                <img src={comment.profileImg} alt="프로필" className="w-4 h-4 rounded-full" />
                                <p className="text-xs font-semibold text-gray-700">{comment.writer}</p>
                            </div>

                            {/* 댓글 수정시 */}
                            <div className="p-2">
                                {editingCommentId === comment.id ? (
                                    <textarea
                                        className="w-full border p-2 rounded-md text-sm"
                                        value={editCommentContent}
                                        onChange={(e) => setEditCommentContent(e.target.value)}
                                        onKeyDown={(e) => handleEditKeyDown(e, comment.id)}
                                    />
                                ) : (
                                    <p className=" text-gray-900">{comment.content}</p>
                                )}
                            </div>

                            {/* ✅ 좋아요 버튼 + 옵션 버튼을 오른쪽에 고정, 입력창과 겹치지 않도록 분리 */}
                            <div className="absolute top-3 right-2 flex items-center space-x-1.5">
                                {/* 좋아요 버튼 */}
                                <button onClick={() => handleCommentLike(comment.id)} className="text-gray-500 flex items-center space-x-1">
                                    {comment.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                                    <span className="text-sm">{comment.likes}</span>
                                </button>

                                {/* 옵션 버튼 (⋮) */}
                                <button onClick={(e) => toggleCommentModal(e, comment.id)} className="text-gray-500">
                                    ⋮
                                </button>
                            </div>


                            {commentModalOpen === comment.id && (
                                <div className="absolute right-4 top-10 bg-white border rounded-md shadow-lg p-2 w-32 z-50">
                                    <ul className="space-y-2 text-gray-700">
                                        {editingCommentId !== comment.id && ( // 수정 중이 아닐 때만 수정 버튼 표시
                                            <li className="cursor-pointer hover:bg-gray-100 p-2" onClick={() => handleEditComment(comment.id, comment.content)}>
                                                수정
                                            </li>
                                        )}
                                        <li className="cursor-pointer hover:bg-gray-100 p-2 " onClick={() => setDeleteCommentId(comment.id)}>
                                            삭제
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>


                    ))}

                </div>

                {/* ✅ 댓글 삭제 확인 모달 */}
                {deleteCommentId !== null && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-5 rounded-lg shadow-md w-80">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">댓글 삭제</h3>
                            <p className="text-gray-600 text-sm mb-4">해당 댓글을 삭제하시겠습니까?</p>
                            <div className="flex justify-end space-x-3">
                                <button onClick={() => setDeleteCommentId(null)} className="bg-gray-400 text-white px-4 py-2 rounded-md">취소</button>
                                <button onClick={() => handleDeleteComment()} className="bg-red-500 text-white px-4 py-2 rounded-md">삭제</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* ✅ 댓글 입력창과 작성 버튼 (높이 동일 & 공간 분리) */}
            <div className="bg-white border-t p-3 sticky bottom-0 left-0 w-full flex items-center z-50">
                {/* 입력창 */}
                <input
                    type="text"
                    className="flex-1 p-3 text-sm focus:outline-none border border-gray-200 h-12"
                    placeholder="댓글을 입력하세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddComment()}
                />

                {/* 작성 버튼 */}
                <button
                    onClick={handleAddComment}
                    className="border rounded-sm text-gray-600 px-4 flex items-center justify-center h-12 "
                >
                    <FaPaperPlane className="text-lg" />
                </button>
            </div>







        </div >
    );
};

export default PostDetailPage;
