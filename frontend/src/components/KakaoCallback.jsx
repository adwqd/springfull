import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {MyContext} from "../App";


const KAKAO_REST_API_KEY = "f9b961caf76caffaab08ed1e2ce895cb"; // 🔥 REST API 키 입력
const REDIRECT_URI = "http://localhost:5173/auth/kakao/callback"; // 🔥 Redirect URI 입력

const KakaoCallback = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            fetchAccessToken(code);
        }
    }, []);

    const fetchAccessToken = async (code) => {
        try {
            const response = await fetch("https://kauth.kakao.com/oauth/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    client_id: KAKAO_REST_API_KEY,
                    redirect_uri: REDIRECT_URI,
                    code,
                }),
            });

            const data = await response.json();
            console.log("🔹 Access Token:", data.access_token);

            if (data.access_token) {
                fetchUserInfo(data.access_token);
            }
        } catch (error) {
            console.error("❌ Access Token 요청 실패:", error);
        }
    };

    const fetchUserInfo = async (accessToken) => {
        try {
            const response = await fetch("https://kapi.kakao.com/v2/user/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const data = await response.json();
            console.log("🔹 사용자 정보:", data);
            setUserInfo(data.kakao_account.profile);
        } catch (error) {
            console.error("❌ 사용자 정보 요청 실패:", error);
        }
    };

    return (
        <div className="p-4">
            <h1>카카오 로그인 결과</h1>
            {userInfo ? (
                <div>
                    <h2>환영합니다, {userInfo.nickname}님!</h2>
                    <img src={userInfo.profile_image_url} alt="프로필" className="w-20 h-20 rounded-full" />
                </div>
            ) : (
                <p>로그인 처리 중...</p>
            )}
        </div>
    );
};

export default KakaoCallback;
