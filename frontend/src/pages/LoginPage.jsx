import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import KakaoLoginButton from "../components/KakaoLoginButton";
import Image from "../assets/Rules!.png"; // ✅ 로그인 배너 이미지

const LoginPage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    // ✅ 로그인 성공 시 사용자 정보 저장
    const handleLoginSuccess = (response) => {
        const profile = response.profile;
        setUserInfo(profile);
        console.log("✅ 로그인 성공:", profile);
        localStorage.setItem("userInfo", JSON.stringify(profile)); // ✅ 사용자 정보 저장
        navigate("/mypage"); // ✅ 로그인 후 마이페이지 이동
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-10 shadow-lg rounded-2xl text-center w-auto flex flex-col items-center">
                {/* ✅ 로그인 배너 이미지 */}
                <img src={Image} alt="로그인 안내 배너" className="w-40 h-40 object-cover rounded-full border border-gray-300 shadow-md" />

                {/* ✅ 안내 문구 */}
                <p className="text-gray-500 text-sm font-semibold mt-4">
                    맛있조합을 이용해주셔서 감사합니다.
                    <br />
                    로그인 후 더 많은 기능을 이용해보세요. 😀
                </p>

                {/* ✅ 로그인 버튼 */}
                <div className="mt-10 w-full">
                    <KakaoLoginButton onLoginSuccess={handleLoginSuccess} />
                </div>

                {/* ✅ 로그인 후 사용자 정보 표시 */}
                {userInfo && (
                    <div className="mt-6">
                        <h2 className="text-lg font-bold">환영합니다, {userInfo.nickname}님!</h2>
                        <img src={userInfo.profile_image} alt="프로필" className="w-24 h-24 rounded-full mx-auto mt-3" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
