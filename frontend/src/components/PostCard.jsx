import React from "react";

const PostCard = ({ post }) => {
    return (
        <div className="border rounded-lg flex items-center p-3 justify-between">
            {/* 썸네일 */}
            <div className="w-16 h-16 bg-gray-200 flex-shrink-0 flex items-center justify-center rounded-md">
                {post.thumbnail ? (
                    <img src={post.thumbnail} alt="thumbnail" className="w-full h-full object-cover rounded-md" />
                ) : (
                    <svg className="w-10 h-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v14a2 2 0 002 2h14a2 2 0 002-2V7M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7l9 6 9-6" />
                    </svg>
                )}
            </div>

            {/* 중앙 컨텐츠 (제목, 작성자) */}
            <div className="ml-4 flex-1">
                <h3 className="font-bold text-sm">{post.title}</h3>
                <p className="text-gray-500 text-xs">{post.writer}</p>
            </div>

            {/* 오른쪽 영역 (날짜, 별점, 좋아요) */}
            <div className="flex flex-col items-end space-y-2">
                {/* 날짜 */}
                <p className="text-gray-400 text-xs">{post.date}</p>

                {/* 평점 & 좋아요 */}
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <span>⭐ {post.rating.toFixed(1)}</span>
                    <span>❤️ {post.likes}</span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
