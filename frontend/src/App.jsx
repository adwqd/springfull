import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OAuthRedirectHandler from "./components/OAuthRedirectHandler";

// 회원 페이지
import HomePage from "./pages/HomePage";
import BrandBoardPage from "./pages/BrandBoardPage";
import PostDetailPage from "./pages/PostDetailPage";
import CategoryRankingPage from "./pages/CategoryRankingPage";
import HotRankingPage from "./pages/HotRankingPage";
import SearchDetailPage from "./pages/SearchDetailPage";
import PostWritePage from "./pages/PostWritePage";
import MyPage from "./pages/MyPage";
import BookmarkPage from "./pages/BookmarkPage";
import MyPostPage from "./pages/MyPostPage";
import StarRatingPage from "./pages/StarRatingPage";
import LoginPage from "./pages/LoginPage";
import PostEditPage from "./pages/PostEditPage";

// 관리자 페이지
import PostReportBoardPage from "./pages/PostReportBoardPage";
import DeleteBoardPage from "./pages/DeleteBoardPage";
import BoardListPage from "./pages/BoardListPage";

// Context API 생성
const MyContext = createContext();

const App = () => {
  // ✅ 로그인 상태 관리
  const [userInfo, setUserInfo] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("jwtToken") || "");

  // ✅ 로그인 성공 시 사용자 정보 및 토큰 저장
  const handleLoginSuccess = (userData, jwtToken) => {
    setUserInfo(userData);
    setToken(jwtToken);
  };

  // ✅ 로그아웃 처리
  const handleLogout = () => {
    setUserInfo(null);
    setToken("");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userInfo");
  };

  // ✅ `userInfo`와 `token`을 로컬스토리지에 저장
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [userInfo]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("jwtToken", token);
    } else {
      localStorage.removeItem("jwtToken");
    }
  }, [token]);

  // ✅ API URL 설정
  const apiURL = "http://192.168.4.10:8081";

  return (
    <MyContext.Provider value={{ apiURL }}>
      <Router>
        <Navbar userInfo={userInfo} onLogout={handleLogout} />
        <div className="pt-5 min-h-screen bg-white overflow-y-auto">
          <Routes>
            {/* 회원 라우팅 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/brands/:brand" element={<BrandBoardPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/category/:category" element={<CategoryRankingPage />} />
            <Route path="/hotRanking" element={<HotRankingPage />} />
            <Route path="/search/detail" element={<SearchDetailPage />} />
            <Route path="/posts/new" element={<PostWritePage />} />
            <Route path="/posts/:id/edit" element={<PostEditPage />} />
            <Route path="/users/me" element={<MyPage userInfo={userInfo} />} />
            <Route path="/users/me/bookmarks" element={<BookmarkPage />} />
            <Route path="/users/me/posts" element={<MyPostPage />} />
            <Route path="/users/me/ratings" element={<StarRatingPage />} />
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/oauth/kakao/callback" element={<OAuthRedirectHandler onLoginSuccess={handleLoginSuccess} />} />

            {/* 관리자 라우팅 */}
            <Route path="/admin/reports" element={<PostReportBoardPage />} />
            <Route path="/admin/list" element={<BoardListPage />} />
            <Route path="/admin/deletedPosts" element={<DeleteBoardPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </MyContext.Provider>
  );
};

export { MyContext };
export default App;
