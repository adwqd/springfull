import React from "react";

const KakaoLoginButton = () => {
    const REST_API_KEY = "6d359ee5b5e0d0aa0ae57d4714f1b04c"; // 🔹 카카오 REST API 키
    const REDIRECT_URI = "http://m-it.iptime.org:50580/oauth/kakao/callback"; // 🔹 리디렉트 URI

    const handleKakaoLogin = () => {
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        window.location.href = kakaoAuthUrl; // 🔹 카카오 로그인 페이지로 이동
    };

    return (
        <button
            onClick={handleKakaoLogin}
            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md shadow-md hover:bg-yellow-500"
        >
            카카오 로그인
        </button>
    );
};

export default KakaoLoginButton;
