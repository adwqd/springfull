import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaCog, FaBookmark, FaStar } from "react-icons/fa";
import KakaoLoginButton from "../components/KakaoLoginButton";
import Image from "../assets/Rules!.png"; // ✅ 이미지 경로 확인


const MyPage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    // ✅ 로그인 상태 확인 (localStorage + 카카오 SDK 세션 확인)
    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo)); // ✅ 사용자 정보 설정
        } else if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
            console.log("🔹 카카오 세션 유지됨, 사용자 정보 불러오기...");
            fetchUserInfo(window.Kakao.Auth.getAccessToken());
        }
    }, []);

    // ✅ 사용자 정보 요청 함수
    const fetchUserInfo = async (accessToken) => {
        try {
            const response = await fetch("https://kapi.kakao.com/v2/user/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            const userData = await response.json();
            console.log("✅ 카카오 사용자 정보:", userData);

            const nickname = userData.kakao_account?.profile?.nickname || "사용자";
            const profileImage = userData.kakao_account?.profile?.profile_image_url || "https://source.unsplash.com/100x100/?avatar";

            console.log("🔹 닉네임:", nickname);

            const userProfile = {
                id: userData.id || "Unknown",
                nickname,
                profile_image: profileImage,
            };

            localStorage.setItem("userInfo", JSON.stringify(userProfile)); // ✅ 사용자 정보 저장
            setUserInfo(userProfile);
        } catch (error) {
            console.error("❌ 사용자 정보 요청 실패:", error);
        }
    };

    const handleLogout = () => {
        if (window.Kakao && window.Kakao.Auth) {
            window.Kakao.Auth.logout(() => {
                console.log("✅ 카카오 로그아웃 완료!");
            });
        }

        // ✅ localStorage에서 모든 로그인 정보 삭제
        localStorage.removeItem("userInfo");
        localStorage.removeItem("kakaoAccessToken");

        setUserInfo(null);
        console.log("✅ 로컬 스토리지 초기화 완료!");

        alert("로그아웃되었습니다.");
        navigate("/login"); // ✅ 로그인 페이지로 이동
    };

    // ✅ 로그인되지 않은 경우 로그인 버튼 표시
    if (!userInfo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen ">
                <div className="bg-white p-10 shadow-lg rounded-2xl text-center w-auto flex flex-col items-center">
                    {/* ✅ 이미지 추가 */}
                    <img src={Image} alt="로그인 안내 배너" className="w-40 h-40 object-cover rounded-full border border-gray-300 shadow-md" />

                    {/* ✅ 안내 문구 */}
                    <p className="text-gray-500 text-sm font-semibold mt-4">
                        맛있조합을 이용해주셔서 감사합니다.
                        <br />
                        로그인 후 더 많은 기능을 이용해보세요. 😀
                    </p>

                    {/* ✅ 로그인 버튼 */}
                    <div className="mt-10 w-full">
                        <KakaoLoginButton />
                    </div>
                </div>
            </div>
        );
    }

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
                    src={userInfo.profile_image || "https://source.unsplash.com/100x100/?avatar"}
                    alt="프로필"
                    className="w-20 h-20 rounded-full border shadow-md"
                />
                <p className="text-lg font-semibold">{userInfo.nickname}</p>

                <button
                    onClick={handleLogout}
                    className="mt-4 bg-gray-400 text-sm  text-white px-3 py-1 rounded-md hover:bg-red-500 transition"
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
            </div>
        </div>
    );
};

export default MyPage;
