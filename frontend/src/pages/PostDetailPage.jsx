import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import {MyContext} from "../App";

//더미 데이터

// 브랜드별 라벨 배경색 지정
const brandColors = {
    5: "bg-green-600 text-white",
    2: "bg-blue-600 text-white",
    1: "bg-purple-600 text-white",
    4: "bg-yellow-500 text-white",
    3: "bg-red-600 text-white",
    0: "bg-gray-600 text-white",
};

const PostDetailPage = () => {
    const {post_no} = useParams();
    const [userInfo, setUserInfo] = useState({
            member_uuid : null
        });

    const [imageIndex, setImageIndex] = useState(0);
    const [replyList, setReplyList] = useState([])
    const [imageUrl, setImageUrl] = useState([]);
    const [replyProfile, setReplyProfile] = useState({});
    const token = localStorage.getItem("token");
    const [post, setPost] = useState({
        post_no : 13,
        title : "",
        content : "",
        cost : 0,
        image : [],
        member_uuid : "",
        brand_id : [],
        taste_id : [],
        ingredient_id : [],
        brand : [ {tag_name: ""}],
        taste : [],
        ingredient : []
    });
    const [profileUrl, setProfileUrl] = useState({});    
    const {apiURL} = useContext(MyContext);
    const navigate = useNavigate();
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
    const [reply, setreply] = useState(post.reply);
    const [commentModalOpen, setCommentModalOpen] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState("");
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [newComment, setNewComment] = useState("");

    //상태 완료 알림
    const [notification, setNotification] = useState("");

    useEffect(() => {
            const storedUserInfo = localStorage.getItem("userInfo");
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo));
              } else {
                navigate("/login"); // ✅ 로그인 안 되어 있으면 로그인 페이지로 이동
            }
        }, []);

    // 백엔드 API 호출 자리 (현재는 더미 데이터 사용)
    useEffect(() => {
        const read = async () => {
            try {
                const response = await axios.get(`${apiURL}/read?post_no=${post_no}&member_uuid=${userInfo.member_uuid}`);
    
                if (response.data !== "") {
                    console.log("aaa", response);
                    setPost(response.data);
                    setRating(response.data.star);
    
                    // 이미지 처리
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
                    setImageUrl(imageUrls);
                    setBookmarked(response.data.bookmark)
    
                    // 🔹 프로필 이미지 요청 (setPost 이후 response.data.member_uuid 사용)
                    if (response.data.member_uuid) {
                        try {
                            const profileResponse = await axios.get(`${apiURL}/profile/${response.data.member_uuid}`, { responseType: "blob" });
                            const profileImgUrl = URL.createObjectURL(profileResponse.data);
                            setProfileUrl(profileImgUrl);
                        } catch (error) {
                            console.error("Error fetching profile image:", error);
                            setProfileUrl(null);
                        }
                    }
    
                } else {
                    alert("글이 없습니다.");
                    history.back();
                }
            } catch (error) {
                console.log("Error fetching post data:", error);
            }
        };
    
        const getReply = async () => {
            try {
                const response = await axios.get(`${apiURL}/reply/${post_no}`);
                console.log(response.data);
                setReplyList(response.data);
    
                const imagePromises = response.data.map(async (data) => {
                    try {
                        if (data.profile_img === null || data.profile_img == "") return { member_uuid: data.member_uuid, profileUrl: null };
                        const profileResponse = await axios.get(`${apiURL}/profile/${data.member_uuid}`, { responseType: "blob" });
                        return { member_uuid: data.member_uuid, profileUrl: URL.createObjectURL(profileResponse.data) };
                    } catch (error) {
                        console.error("Error fetching profile image:", error);
                        return { member_uuid: data.member_uuid, profileUrl: null };
                    }
                });
    
                // 모든 이미지 요청이 완료될 때까지 기다림
                const images = await Promise.all(imagePromises);
    
                // imageUrl을 member_uuid 별로 매핑
                setReplyProfile((prev) => {
                    const newImageUrls = { ...prev };
                    images.forEach(({ member_uuid, profileUrl }) => {
                        newImageUrls[member_uuid] = profileUrl;
                    });
                    return newImageUrls;
                });
            } catch (error) {
                console.error("Error fetching replies:", error);
            }
        };
    
        read();
        getReply();
    }, [post_no, userInfo]); // 🔹 post_no가 바뀔 때도 실행
    

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
        const star = async (stars) => {
            const star = {
                post_no : post_no,
                member_uuid : userInfo.member_uuid,
                star : stars
            }
            const response = await axios.post(`${apiURL}/member/star`, star, {
                headers: {
                    Authorization: `Bearer ${token}` // 실제 JWT 토큰
                }
            });
            console.log(response);
        }
        
        star(newRating);
    };

    // 북마크 토글
    const handleBookmark = () => {
        setBookmarked(!bookmarked);
        showNotification(bookmarked ? "게시글 북마크를 취소했습니다." : "게시글을 북마크했습니다");
        const bookmark = async () => {           
            const response = await axios.get(`${apiURL}/member/bookmark/${post_no}`, {
                headers: {
                    Authorization: `Bearer ${token}` // 실제 JWT 토큰
                }
            });
            console.log(response);
        }
        bookmark();
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
        let res = "";
        try {
            console.log(`🚮 게시글 삭제 요청: ${post.id}`);
            const deletePost = async () => {           
                const response = await axios.delete(`${apiURL}/member/post/${post_no}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // 실제 JWT 토큰
                    }
                });
                console.log(response);
                res = response.data;
                console.log(res);
                if(res ==null || res ==""){
                    alert("✅ 게시글이 삭제되었습니다.");
                    navigate("/users/me"); // 삭제 후 마이페이지로 이동
                }else{
                    alert(res);
                }
            }
            deletePost();
            toggleDeleteModal();
        } catch (error) {
            console.error("게시글 삭제 오류:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    //댓글 ------------------------------------------------------------------------------------------------------------------------------------------
    // 댓글 좋아요 토글 (색상 변경 & 숫자 업데이트)
    const handleCommentLike = (commentId) => {
        setreply((prevreply) => {
            return prevreply.map((comment) => {
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
        setEditingCommentId(userInfo.member_uuid);
        setEditCommentContent(content);
        setCommentModalOpen(null);
    };
    // ✅ 댓글 수정 저장 (Enter 키 적용)
    const handleSaveEditComment = (commentId) => {
        if (editCommentContent.trim() === "") return;
        setreply((prev) =>
            prev.map((comment) =>
                comment.id === commentId ? { ...comment, content: editCommentContent } : comment
            )
        );
        const newCommentObj = {
            reply_content: editCommentContent,
            post_no : post_no
        };
        const reply = async () => {           
            const response = await axios.put(`${apiURL}/member/reply`, newCommentObj, {
                headers: {
                    Authorization: `Bearer ${token}` // 실제 JWT 토큰
                }
            });
            console.log(response);
        }
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
            setreply((prevreply) => prevreply.filter((comment) => comment.id !== deleteCommentId));
            setDeleteCommentId(null);
            showNotification("댓글이 삭제되었습니다.");
        }
    };


    //댓글 작성
    const handleAddComment = () => {
        if (newComment.trim() === "") return;
        const newCommentObj = {
            profileImg: "https://source.unsplash.com/40x40/?profile", // 더미 프로필 이미지 추가
            reply_content: newComment,
            date: formatDate(new Date()),
            likes: 0,
            liked: false,
            post_no : post_no
        };
        const reply = async () => {           
            const response = await axios.post(`${apiURL}/member/reply`, newCommentObj, {
                headers: {
                    Authorization: `Bearer ${token}` // 실제 JWT 토큰
                }
            });
            console.log(response);
        }
        reply();
        //setNewComment(""); // 입력창 초기화
        showNotification("댓글이 작성되었습니다.");
        location.reload();
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

    const changeImage = () => {
        let i = imageIndex+1;
        if(i>=imageUrl.length){
            i =0;
        }
        setImageIndex(i);
        console.log(i);
    }
    useEffect(()=>{
    }, [imageIndex, editingCommentId])



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
                <div className={`absolute top-4 right-4 px-4 py-1 text-sm font-semibold rounded-md ${brandColors[post.brand_id[0]] || "bg-gray-600 text-white"}`}>
                    {post.brand[0].tag_name}
                </div>



                {/* 🔹 이미지 ( 이미지 없으면 숨김) */}
                {post.image[0] && (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                        <img src={imageUrl[imageIndex]} alt="게시글 이미지" className="w-full h-full object-cover rounded-md" onClick={changeImage} style={{ maxHeight: "200px", height: "auto" }}/>
                    </div>
                )}
                {/* 🔹 게시글 헤더 */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">{post.title} ({post.cost})</h2>
                    <button onClick={togglePostModal} className="text-gray-600 text-lg modal">⋮</button>
                </div>

                {/* 🔹 작성자 정보 */}
                <div className="flex items-center space-x-3 border-b pb-2 border-gray-200">
                    <img src={profileUrl} alt="프로필" className="w-6 h-6 rounded-full" />
                    <div>
                        <p className="text-xs font-semibold">{post.name}</p>
                        <p className="text-xs text-gray-500">{post.reg_date}</p>

                    </div>
                </div>

                {/* 🔹 게시글 모달 */}
                {postModalOpen && (
                    <div className="absolute top-12 right-4 bg-white border rounded-md shadow-lg p-2 w-40 modal z-50">
                        <ul className="space-y-2 text-gray-700">
                            <li className="cursor-pointer hover:bg-gray-100 p-2" onClick={() => navigate(`/posts/${post.post_no}/edit`)}>수정</li>
                            <li className="cursor-pointer hover:bg-gray-100 p-2" onClick={toggleDeleteModal}>삭제</li>
                            <li className="cursor-pointer hover:bg-gray-100 p-2" onClick={toggleReportModal}>신고</li>
                        </ul>
                    </div>
                )}

                {/* 🔹 게시글 내용 */}

                <pre className="whitespace-pre-wrap text-gray-700 text-sm">{post.content}</pre>
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
                        <span>{post.star ? post.star.toFixed(1) : "0"}</span>
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
                        {post.ingredient.map((ingredient, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-md whitespace-nowrap">
                                # {ingredient.tag_name}
                            </span>
                        ))}
                        {post.taste.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-md whitespace-nowrap">
                                # {tag.tag_name}
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

                    {replyList.map((reply) => (
                        <div key={reply.reply_no} className="mt-3 border p-3 rounded-md shadow-sm relative text-sm">

                            {/* 작성자 정보*/}
                            <div className="flex items-center space-x-2">
                                <img src={replyProfile[reply.member_uuid]} alt="프로필" className="w-4 h-4 rounded-full" />
                                <p className="text-xs font-semibold text-gray-700">{reply.name}</p>
                            </div>

                            {/* 댓글 수정시 */}
                            <div className="p-2">
                                {editingCommentId === reply.reply_no ? (
                                    <textarea
                                        className="w-full border p-2 rounded-md text-sm"
                                        value={editCommentContent}
                                        onChange={(e) => setEditCommentContent(e.target.value)}
                                        onKeyDown={(e) => handleEditKeyDown(e, reply.reply_no)}
                                    />
                                ) : (
                                    <p className=" text-gray-900">{reply.reply_content}</p>
                                )}
                            </div>

                            {/* ✅ 좋아요 버튼 + 옵션 버튼을 오른쪽에 고정, 입력창과 겹치지 않도록 분리 */}
                            <div className="absolute top-3 right-2 flex items-center space-x-1.5">
                                {/* 좋아요 버튼 */}
                                <button onClick={() => handleCommentLike(reply.reply_no)} className="text-gray-500 flex items-center space-x-1">
                                    {reply.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                                    <span className="text-sm">{reply.reply_like}</span>
                                </button>

                                {/* 옵션 버튼 (⋮) */}
                                <button onClick={(e) => toggleCommentModal(e, reply.reply_no)} className="text-gray-500">
                                    ⋮
                                </button>
                            </div>


                            {commentModalOpen === reply.reply_no && (
                                <div className="absolute right-4 top-10 bg-white border rounded-md shadow-lg p-2 w-32 z-50">
                                    <ul className="space-y-2 text-gray-700">
                                        {editingCommentId !== reply.member_uuid && ( // 수정 중이 아닐 때만 수정 버튼 표시
                                            <li className="cursor-pointer hover:bg-gray-100 p-2" onClick={() => handleEditComment(reply.reply_no, reply.reply_content)}>
                                                수정
                                            </li>
                                        )}
                                        <li className="cursor-pointer hover:bg-gray-100 p-2 " onClick={() => setDeleteCommentId(reply.reply_no)}>
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
