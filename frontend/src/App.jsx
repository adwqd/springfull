import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import KakaoLoginButton from "./components/KakaoLoginButton";
import KakaoAuthHandler from "./components/KakaoAuthHandler";
import KakaoCallback from "./components/KakaoCallback";
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
import BoardListPage
  from "./pages/BoardListPage";
const App = () => {
  // ✅ 로그인 상태 관리
  const [userInfo, setUserInfo] = useState(null);

  // ✅ 로그인 성공 시 사용자 정보 저장
  const handleLoginSuccess = (userData) => {
    setUserInfo(userData);
  };

  // ✅ 로그아웃 처리
  const handleLogout = () => {
    setUserInfo(null);
  };

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);


  return (
    <>
      <Router>

        <Navbar userInfo={userInfo} onLogout={handleLogout} />
        <div className="pt-5 min-h-screen bg-white overflow-y-auto">
          <Routes>
            {/* 회원 라우팅 */}
            {/* 메인페이지 */}
            <Route path="/" element={<HomePage />} />
            {/* 브랜드 게시글 목록 페이지*/}
            <Route path="/brands/:brand" element={<BrandBoardPage />} />
            {/* 게시글 상세보기 페이지 */}
            <Route path="/posts/:id" element={<PostDetailPage />} />
            {/* 카테고리 랭킹 페이지 */}
            <Route path="/category/:category" element={<CategoryRankingPage />} />
            {/* 급상승 랭킹 페이지 */}
            <Route path="/hotRanking" element={<HotRankingPage />} />
            {/* 검색창 페이지 */}
            <Route path="/search/detail" element={<SearchDetailPage />} />
            {/* 글 작성 페이지 */}
            <Route path="/posts/new" element={<PostWritePage />} />
            {/* 글 수정/삭제 페이지 */}
            <Route path="/posts/:id/edit" element={<PostEditPage />} />

            {/* 마이페이지 */}
            <Route path="/users/me" element={<MyPage userInfo={userInfo} />} />
            {/* 북마크 목록 페이지 */}
            <Route path="/users/me/bookmarks" element={<BookmarkPage />} />
            {/* 내가 쓴 글 목록 페이지 */}
            <Route path="/users/me/posts" element={<MyPostPage />} />
            {/* 내가 매긴 별점을 모아는 목록 페이지 */}
            <Route path="/users/me/ratings" element={<StarRatingPage />} />
            {/* 프로필 수정 페이지 - 카카오로 연결
            <Route path="/users/me/edit" element={<ProfileEditPage />} /> */}

            {/* 기타 */}
            {/* 로그인 페이지 */}
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/oauth/kakao/callback" element={<OAuthRedirectHandler onLoginSuccess={setUserInfo} />} />


            {/* 관리자 라우팅 */}
            {/* 관리자 로그인 페이지 - 카카오 로그인으로 관리자 권한을 준뒤 토큰을 확인 후 관리자 페이지확인*/}
            {/* <Route path="/admin/login" element={<AdminLoginPage />} /> */}
            {/* 신고받은 게시글 목록 페이지 */}
            <Route path="/admin/reports" element={<PostReportBoardPage />} />
            {/* 전체 게시글 목록 페이지 */}
            <Route path="/admin/list" element={<BoardListPage />} />
            {/* 삭제된 게시글 목록 페이지 */}
            <Route path="/admin/deletedPosts" element={<DeleteBoardPage />} />
            {/* 회원관리 페이지 */}
            {/* <Route path="/admin/user_list" element={<DeleteBoardPage />} /> */}
          </Routes>
        </div>

        <Footer />

      </Router >
    </>
  );
};

export default App;
