import { useEffect } from "react";

const KAKAO_REST_API_KEY = "f9b961caf76caffaab08ed1e2ce895cb";
const REDIRECT_URI = "http://localhost:5173/auth/kakao/callback";

const KakaoAuthHandler = () => {
    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        if (code) {
            getAccessToken(code);
        }
    }, []);

    const getAccessToken = async (code) => {
        const response = await fetch("https://kauth.kakao.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: KAKAO_REST_API_KEY,
                redirect_uri: REDIRECT_URI,
                code,
            }),
        });

        const data = await response.json();
        console.log("Access Token:", data.access_token);
        getUserInfo(data.access_token);
    };

    const getUserInfo = async (token) => {
        const response = await fetch("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const userInfo = await response.json();
        console.log("User Info:", userInfo);
    };

    return <p>카카오 로그인 중...</p>;
};

export default KakaoAuthHandler;
