import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KAKAO_CLIENT_ID = "534cb5dc275508d96089504a240da925"; // ✅ JavaScript 키 사용
const REDIRECT_URI = "http://localhost:5173/oauth/kakao/callback"; // ✅ 반드시 카카오 개발자 콘솔과 일치

const KakaoLoginButton = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.Kakao) {
            console.log("🔹 카카오 SDK 로드 중...");
            const script = document.createElement("script");
            script.src = "https://developers.kakao.com/sdk/js/kakao.js";
            script.async = true;
            script.onload = () => {
                if (!window.Kakao.isInitialized()) {
                    window.Kakao.init(KAKAO_CLIENT_ID);
                    console.log("✅ 카카오 SDK 초기화 완료!");
                }
            };
            document.body.appendChild(script);
        } else {
            console.log("✅ 카카오 SDK 이미 로드됨!");
        }
    }, []);

    // ✅ 카카오 사용자 정보 요청 함수 추가
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

            const userProfile = {
                id: userData.id,
                nickname: userData.kakao_account?.profile?.nickname || "사용자",
                profile_image: userData.kakao_account?.profile?.profile_image_url || "https://source.unsplash.com/100x100/?avatar",
            };

            localStorage.setItem("userInfo", JSON.stringify(userProfile)); // ✅ 사용자 정보 저장
            alert(`카카오 로그인 성공! ${userProfile.nickname}님 환영합니다!`);

            navigate("/users/me"); // ✅ 로그인 후 마이페이지 이동
        } catch (error) {
            console.error("❌ 사용자 정보 요청 실패:", error);
            alert("카카오 사용자 정보 요청 실패");
            // navigate("/login");
        }
    };

    // ✅ 카카오 로그인 실행 (인가 코드 없이 바로 액세스 토큰 요청)
    const handleLogin = () => {
        if (!window.Kakao || !window.Kakao.isInitialized()) {
            console.error("❌ 카카오 SDK 로드 실패 또는 초기화되지 않음");
            alert("카카오 로그인 실패: SDK 초기화 오류");
            return;
        }

        console.log("🔹 카카오 로그인 시작...");
        window.Kakao.Auth.login({
            scope: "profile_nickname,profile_image", // ✅ 추가로 필요한 정보 요청 가능
            success: function (authObj) {
                console.log("✅ 로그인 성공! 액세스 토큰:", authObj.access_token);
                localStorage.setItem("kakaoAccessToken", authObj.access_token);
                fetchUserInfo(authObj.access_token); // ✅ 사용자 정보 요청
            },
            fail: function (err) {
                console.error("❌ 로그인 실패:", err);
                alert("카카오 로그인 실패");
            },
        });
    };

    return (
        <button
            onClick={handleLogin}
            className="bg-yellow-400 p-2 px-20 rounded-lg font-bold text-gray-600 shadow-md hover:bg-yellow-500 transition"
        >
            카카오 로그인
        </button>
    );
};

export default KakaoLoginButton;
