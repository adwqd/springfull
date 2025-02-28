import { useState, useEffect } from "react";

const localStorageCom = () => {
    const [bookmarks, setBookmarks] = useState(JSON.parse(localStorage.getItem("bookmarks")) || []);
    const [likes, setLikes] = useState(JSON.parse(localStorage.getItem("likes")) || {});

    useEffect(() => {
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }, [bookmarks]);

    useEffect(() => {
        localStorage.setItem("likes", JSON.stringify(likes));
    }, [likes]);

    const toggleBookmark = (postId) => {
        setBookmarks(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]);
    };

    const toggleLike = (postId) => {
        setLikes(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    return (
        <div>
            <button onClick={() => toggleBookmark(123)}>
                {bookmarks.includes(123) ? "북마크 취소" : "북마크 추가"}
            </button>
            <button onClick={() => toggleLike(123)}>
                {likes[123] ? "좋아요 취소" : "좋아요"}
            </button>
        </div>
    );
};

export default localStorageCom;
