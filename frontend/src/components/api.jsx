import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081/api", // ✅ 백엔드 기본 주소만 설정
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔹 요청을 보낼 때 인증 토큰이 필요하면 추가
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken"); // 예제: 로컬스토리지에 저장된 토큰 사용
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
