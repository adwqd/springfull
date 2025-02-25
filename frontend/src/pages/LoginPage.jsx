import React, { useState } from "react";
import KakaoLoginButton from "../components/KakaoLoginButton";

const LoginPage = () => {
    const [userInfo, setUserInfo] = useState(null);

    const handleLoginSuccess = (response) => {
        setUserInfo(response.profile); // 카카오 프로필 정보 저장
        console.log("사용자 정보:", response.profile);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {!userInfo ? (
                <div className="bg-white p-6 shadow-lg rounded-lg text-center">
                    <h1 className="text-xl font-bold mb-4">카카오 로그인</h1>
                    <KakaoLoginButton onLoginSuccess={handleLoginSuccess} />
                </div>
            ) : (
                <div className="bg-white p-6 shadow-lg rounded-lg text-center">
                    <h2 className="text-xl font-bold mb-4">환영합니다, {userInfo.nickname}님!</h2>
                    <img src={userInfo.profile_image} alt="프로필" className="w-24 h-24 rounded-full mx-auto" />
                </div>
            )}
        </div>
    );
};

export default LoginPage;
