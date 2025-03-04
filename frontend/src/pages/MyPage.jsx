import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaCog, FaBookmark, FaStar, FaFile, FaPortrait, FaBell } from "react-icons/fa";
import KakaoLoginButton from "../components/KakaoLoginButton";
import Image from "../assets/Rules!.png"; // ✅ 이미지 경로 확인
import axios from "axios";
import {MyContext} from "../App";

const REST_API_KEY = "6d359ee5b5e0d0aa0ae57d4714f1b04c"; // 🔹 카카오 REST API 키
const REDIRECT_URI = "http://m-it.iptime.org:50580"; // 🔹 로그아웃 리디렉트 URI

const MyPage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [profileUrl, setProfileUrl] = useState({});
    const {apiURL} = useContext(MyContext);

    // ✅ 로그인 상태 확인 (localStorage + 카카오 SDK 세션 확인)
    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
          } else {
            navigate("/login"); // ✅ 로그인 안 되어 있으면 로그인 페이지로 이동
        }
    }, [navigate]);
    useEffect(() => {
        const fetchImage = async () => {
            if (!userInfo || !userInfo.member_uuid) return;

            try {
                // 이미지 데이터를 비동기로 요청
                const profileResponse = await axios.get(
                    `${apiURL}/profile/${userInfo.member_uuid}`,
                    { responseType: 'blob' }
                );

                // 이미지 URL을 생성하고 상태 업데이트
                const imageUrl = URL.createObjectURL(profileResponse.data);
                setProfileUrl(imageUrl);

            } catch (error) {
                console.error('Error fetching image:', error);
                setProfileUrl(null);
            }
        };

        fetchImage();
    }, [userInfo, apiURL]);

    // ✅ 사용자 정보 요청 함수
    // const fetchUserInfo = async (accessToken) => {
    //     try {
    //         const response = await fetch("https://kapi.kakao.com/v2/user/me", {
    //             method: "GET",
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //                 "Content-Type": "application/json",
    //             },
    //         });

    //         const userData = await response.json();
    //         console.log("✅ 카카오 사용자 정보:", userData);

    //         const name = userData.kakao_account?.profile?.name || "사용자";
    //         const profileImage = userData.kakao_account?.profile?.profile_image_url || "https://source.unsplash.com/100x100/?avatar";

    //         const userProfile = {
    //             id: userData.id || "Unknown",
    //             name,
    //             profile_image: profileImage,
    //         };

    //         localStorage.setItem("userInfo", JSON.stringify(userProfile)); // ✅ 사용자 정보 저장
    //         setUserInfo(userProfile);
    //     } catch (error) {
    //         console.error("❌ 사용자 정보 요청 실패:", error);
    //     }
    // };

    // ✅ 로그아웃 처리
    const handleLogout = () => {
        if (window.Kakao && window.Kakao.Auth) {
            window.Kakao.Auth.logout(() => {
                console.log("✅ 카카오 로그아웃 완료!");
            });
        }
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo"); // ✅ localStorage에서 로그인 정보 삭제
        setUserInfo(null);
        console.log("✅ 로컬 스토리지 초기화 완료!");
        const logOut = () => {
            const logout = `https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${REDIRECT_URI}`;
            window.location.href = logout;
        }
        
        logOut();
        //alert("로그아웃되었습니다.");
        navigate("/login"); // ✅ 로그인 페이지로 이동
    };

    // ✅ 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    if (!userInfo) return null;

    return (
        <div className="max-w-md mx-auto p-4 space-y-6">
            {/* 🔙 뒤로가기 버튼 */}
            <button onClick={() => navigate(-1)} className="text-gray-600 flex items-center space-x-2">
                <FaArrowLeft /> <span className="text-sm">뒤로가기</span>
            </button>

            {/* 🏷 마이페이지 헤더 */}
            <h2 className="text-xl font-bold text-center">마이페이지 🙍‍♂️</h2>

            {/* 프로필 카드 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center space-y-3">
                <img
                    src={profileUrl || "https://source.unsplash.com/100x100/?avatar"}
                    alt="프로필"
                    className="w-20 h-20 rounded-full border shadow-md"
                />
                <p className="text-lg font-semibold">{userInfo.name}</p>

                <button
                    onClick={handleLogout}
                    className="mt-4 bg-gray-400 text-sm text-white px-3 py-1 rounded-md hover:bg-red-500 transition"
                >
                    로그아웃
                </button>
            </div>

            {/* 📌 메뉴 목록 */}
            <div className="bg-white shadow-md rounded-lg divide-y">
                <button
                    className="flex items-center justify-between p-4 w-full text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate("/users/me/edit")}
                >
                    프로필 관리 <FaCog />
                </button>
                <button
                    className="flex items-center justify-between p-4 w-full text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate("/users/me/posts")}
                >
                    작성한 글 <FaEdit />
                </button>
                <button
                    className="flex items-center justify-between p-4 w-full text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate("/users/me/ratings")}
                >
                    별점 준 글 <FaStar />
                </button>
                <button
                    className="flex items-center justify-between p-4 w-full text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate("/users/me/bookmarks")}
                >
                    북마크 <FaBookmark />
                </button>
                {userInfo.state==0 &&
                <div className="bg-white shadow-md rounded-lg divide-y">
                    <button
                    className="flex items-center justify-between p-4 w-full text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate("/admin/reports")}
                >
                    신고 게시판 <FaBell />
                </button>
                <button
                    className="flex items-center justify-between p-4 w-full text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate("/admin/list")}
                >
                    전체 게시판 <FaFile />
                </button>
                </div>
                }
                
            </div>
        </div>
    );
};

export default MyPage;
