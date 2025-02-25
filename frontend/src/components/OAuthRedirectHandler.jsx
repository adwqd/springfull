import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KAKAO_CLIENT_ID = "534cb5dc275508d96089504a240da925"; // ✅ REST API 키 사용
const REDIRECT_URI = "http://localhost:5173/oauth/kakao/callback"; // ✅ 반드시 카카오 개발자 콘솔과 일치

const OAuthRedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("✅ OAuthRedirectHandler 실행됨!");

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code"); // ✅ 카카오에서 받은 인가 코드 확인

        console.log("🔹 URL에서 추출한 인가 코드:", code);

        if (code) {
            console.log("✅ 카카오 로그인 성공! 인가 코드:", code);
            fetchAccessToken(code); // ✅ 액세스 토큰 요청
        } else {
            console.error("❌ 카카오 로그인 실패: 인가 코드 없음");
            alert("카카오 로그인 실패");
            navigate("/login"); // 로그인 페이지로 이동
        }
    }, []);

    // ✅ 액세스 토큰 요청 함수
    const fetchAccessToken = async (code) => {
        console.log("🔹 fetchAccessToken 실행됨, 인가 코드:", code);

        try {
            // ✅ 기존 인가 코드 삭제 (중복 사용 방지)
            localStorage.removeItem("kakaoAuthCode");

            const response = await fetch("https://kauth.kakao.com/oauth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    client_id: "your-rest-api-key", // ✅ JavaScript 키가 아닌 REST API 키 사용!
                    redirect_uri: "http://localhost:5173/oauth/kakao/callback", // ✅ 반드시 카카오 개발자 콘솔과 동일해야 함
                    code: code, // ✅ 로그인 후 받은 인가 코드
                }),
            });

            const data = await response.json();
            console.log("🔹 카카오 액세스 토큰 응답:", data);

            if (data.access_token) {
                localStorage.setItem("kakaoAccessToken", data.access_token); // ✅ 액세스 토큰 저장
                fetchUserInfo(data.access_token); // ✅ 사용자 정보 가져오기
            } else {
                console.error("❌ 액세스 토큰 요청 실패:", data);
                alert("카카오 로그인 실패: 인가 코드 문제 발생 (코드가 만료되었을 가능성이 있음)");
                navigate("/login");
            }
        } catch (error) {
            console.error("❌ 카카오 로그인 오류:", error);
            alert("카카오 로그인 오류 발생");
            navigate("/login");
        }
    };


    // ✅ 사용자 정보 요청 함수 (이메일 제거 & 마이페이지 이동 추가)
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
            navigate("/login");
        }
    };



    return <p>카카오 로그인 처리 중...</p>;
};

export default OAuthRedirectHandler;
