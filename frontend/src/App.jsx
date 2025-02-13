import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
import ProfileEditPage from "./pages/ProfileEditPage";
import LoginPage from "./pages/LoginPage";
import ChatbotPage from "./pages/ChatbotPage";
import PostEditPage from "./pages/PostEditPage";

// 관리자 페이지
import AdminLoginPage from "./pages/AdminLoginPage";
import PostReportBoardPage from "./pages/PostReportBoardPage";
import DeleteBoardPage from "./pages/DeleteBoardPage";

const App = () => {
  return (
    <Router>

      <Navbar />
      <div className="pt-16 min-h-screen bg-white overflow-y-auto">
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
          <Route path="/users/me" element={<MyPage />} />
          {/* 북마크 목록 페이지 */}
          <Route path="/users/me/bookmarks" element={<BookmarkPage />} />
          {/* 내가 쓴 글 목록 페이지 */}
          <Route path="/users/me/posts" element={<MyPostPage />} />
          {/* 내가 매긴 별점을 모아는 목록 페이지 */}
          <Route path="/users/me/ratings" element={<StarRatingPage />} />
          {/* 프로필 수정 페이지 */}
          <Route path="/users/me/edit" element={<ProfileEditPage />} />

          {/* 기타 */}
          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          {/* 챗봇 페이지 */}
          <Route path="/chatbot" element={<ChatbotPage />} />

          {/* 관리자 라우팅 */}
          {/* 관리자 로그인 페이지 */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          {/* 신고받은 게시글 목록 페이지 */}
          <Route path="/admin/reports" element={<PostReportBoardPage />} />
          {/* 삭제된 게시글 목록 페이지 */}
          <Route path="/admin/deletedPosts" element={<DeleteBoardPage />} />
        </Routes>
      </div>

      <Footer />

    </Router >

  );
};

export default App;
