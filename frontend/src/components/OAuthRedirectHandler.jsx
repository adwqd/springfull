import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {MyContext} from "../App";

const KAKAO_REST_API_KEY = "f9b961caf76caffaab08ed1e2ce895cb"; // 🔥 REST API 키
const REDIRECT_URI = "http://localhost:5173/oauth/kakao/callback"; // 🔥 카카오 개발자 콘솔과 일치해야 함


// 🔹 OAuth Redirect 처리 컴포넌트
const OAuthRedirectHandler = () => {
    const navigate = useNavigate();
    const {apiURL} = useContext(MyContext);

    useEffect(() => {
        console.log("✅ OAuthRedirectHandler 실행됨!");

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code"); // 🔹 카카오에서 받은 인가 코드 확인

        console.log("🔹 URL에서 추출한 인가 코드:", code);

        if (code) {
            fetchUserInfo(code); // 🔹 인가 코드로 액세스 토큰 요청
        } else {
            console.error("❌ 카카오 로그인 실패: 인가 코드 없음");
            alert("카카오 로그인 실패");
            navigate("/login"); // 로그인 페이지로 이동
        }
    }, []);

    // 🔹 액세스 토큰 요청 함수
    // const fetchAccessToken = async (code) => {
    //     console.log("🔹 fetchAccessToken 실행됨, 인가 코드:", code);

    //     try {
    //         const response = await fetch("https://kauth.kakao.com/oauth/token", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/x-www-form-urlencoded",
    //             },
    //             body: new URLSearchParams({
    //                 grant_type: "authorization_code",
    //                 client_id: KAKAO_REST_API_KEY,
    //                 redirect_uri: REDIRECT_URI,
    //                 code: code,

    //             }),
    //         });

    //         const data = await response.json();
    //         console.log("🔹 카카오 액세스 토큰 응답:", data);

    //         if (data.access_token) {
    //             localStorage.setItem("kakaoAccessToken", data.access_token); // ✅ 액세스 토큰 저장
    //             fetchUserInfo(data.access_token); // ✅ 사용자 정보 가져오기
    //         } else {
    //             console.error("❌ 액세스 토큰 요청 실패:", data);
    //             alert("카카오 로그인 실패: 인가 코드 문제 발생 (코드가 만료되었을 가능성이 있음)");
    //             navigate("/login");
    //         }
    //     } catch (error) {
    //         console.error("❌ 카카오 로그인 오류:", error);
    //         alert("카카오 로그인 오류 발생");
    //         navigate("/login");
    //     }
    // };

    // 🔹 사용자 정보 요청 함수
    const fetchUserInfo = async (code) => {
        try {
            
            const response = await axios.get(`${apiURL}/kakao/callback?code=${code}`, {});
            console.log("로그인 응답", response);
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);

            const userData = await response.data;
            console.log("✅ 카카오 사용자 정보:", userData);

            const userProfile = {
                member_uuid: userData.member_uuid,
                name: userData.name || "사용자",
                state : userData.state
            };

            localStorage.setItem("userInfo", JSON.stringify(userProfile)); // ✅ 사용자 정보 저장
            alert(`카카오 로그인 성공! ${userProfile.name}님 환영합니다!`);

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
