import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthKakao = () => {
    const navigate = useNavigate();
    const REST_API_KEY = "6d359ee5b5e0d0aa0ae57d4714f1b04c"; // 🔹 카카오 REST API 키
    const REDIRECT_URI = "http://m-it.iptime.org:50580/oauth/kakao/callback"; // 🔹 리디렉트 URI

    useEffect(() => {
        const getKakaoToken = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code"); // 🔹 인가 코드 가져오기

            if (!code) {
                console.error("인가 코드가 없습니다.");
                navigate("/login");
                return;
            }

            try {
                // 🔹 카카오 액세스 토큰 요청
                const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        grant_type: "authorization_code",
                        client_id: REST_API_KEY,
                        redirect_uri: REDIRECT_URI,
                        code,
                    }),
                });

                const tokenData = await tokenResponse.json();

                if (!tokenData.access_token) {
                    console.error("토큰 발급 실패:", tokenData);
                    navigate("/login");
                    return;
                }

                // 🔹 사용자 정보 요청
                const userInfoResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${tokenData.access_token}`,
                        "Content-Type": "application/json",
                    },
                });

                const userInfo = await userInfoResponse.json();

                // 🔹 사용자 정보 저장
                const userProfile = {
                    id: userInfo.id,
                    nickname: userInfo.kakao_account?.profile?.nickname || "사용자",
                    profile_image: userInfo.kakao_account?.profile?.profile_image_url || "https://source.unsplash.com/100x100/?avatar",
                    access_token: tokenData.access_token, // 🔹 액세스 토큰 저장
                };

                localStorage.setItem("userInfo", JSON.stringify(userProfile));

                console.log("✅ 로그인 성공:", userProfile);
                navigate("/users/me"); // 🔹 마이페이지로 이동
            } catch (error) {
                console.error("카카오 로그인 오류:", error);
                navigate("/login");
            }
        };

        getKakaoToken();
    }, [navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>카카오 로그인 중...</p>
        </div>
    );
};

export default AuthKakao;
