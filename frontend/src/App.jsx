import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import KakaoAuthHandler from "./components/KakaoAuthHandler";
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

const App = () => {
  // ✅ 로그인 상태 관리
  const [userInfo, setUserInfo] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  // ✅ 로그인 정보 불러오기
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // ✅ 최근 본 글 불러오기
  useEffect(() => {
    const storedPosts = localStorage.getItem("recentPosts");
    if (storedPosts) {
      setRecentPosts(JSON.parse(storedPosts));
    }
  }, []);

  // ✅ 최근 본 글 추가 (최대 5개 유지)
  const addRecentPost = (post) => {
    setRecentPosts((prevPosts) => {
      const updatedPosts = [post, ...prevPosts.filter((p) => p.id !== post.id)].slice(0, 5);
      localStorage.setItem("recentPosts", JSON.stringify(updatedPosts));
      return updatedPosts;
    });
  };

  return (
    <Router>
      <div className="flex">
        {/* ✅ 네비바 */}
        <Navbar userInfo={userInfo} />


        <div className="flex flex-grow">
          {/* 🌟 메인 콘텐츠 영역 */}
          <div className="mt-16 lg:mt-10 flex-grow pt-5 px-6 min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/brands/:brand" element={<BrandBoardPage />} />
              <Route
                path="/posts/:id"
                element={<PostDetailPage addRecentPost={addRecentPost} />} // ✅ 최근 본 글 추가 기능 전달
              />
              <Route path="/category/:category" element={<CategoryRankingPage />} />
              <Route path="/hotRanking" element={<HotRankingPage />} />
              <Route path="/search/detail" element={<SearchDetailPage />} />
              <Route path="/posts/new" element={<PostWritePage />} />
              <Route path="/posts/:id/edit" element={<PostEditPage />} />
              <Route path="/users/me" element={<MyPage />} />
              <Route path="/users/me/bookmarks" element={<BookmarkPage />} />
              <Route path="/users/me/posts" element={<MyPostPage />} />
              <Route path="/users/me/ratings" element={<StarRatingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/oauth/kakao/callback" element={<OAuthRedirectHandler onLoginSuccess={setUserInfo} />} />

              {/* 관리자 페이지 */}
              <Route path="/admin/reports" element={<PostReportBoardPage />} />
              <Route path="/admin/list" element={<BoardListPage />} />
              <Route path="/admin/deletedPosts" element={<DeleteBoardPage />} />
            </Routes>
          </div>

        </div>
      </div>

      <Footer />
    </Router>
  );
};

export default App;
