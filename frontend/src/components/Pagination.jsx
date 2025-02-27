import React, { useState, useEffect } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // 초기 groupSize 기본값 (10)
    const [groupSize, setGroupSize] = useState(10);

    useEffect(() => {
        const updateGroupSize = () => {
            // 예를 들어, 768px 미만이면 모바일, 그렇지 않으면 데스크톱
            if (window.innerWidth < 768) {
                setGroupSize(5);
            } else {
                setGroupSize(10);
            }
        };

        updateGroupSize();
        window.addEventListener("resize", updateGroupSize);
        return () => window.removeEventListener("resize", updateGroupSize);
    }, []);

    const currentGroup = Math.floor((currentPage - 1) / groupSize);
    const startPage = currentGroup * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const handlePrevGroup = () => {
        if (startPage > 1) onPageChange(startPage - 1);
    };

    const handleNextGroup = () => {
        if (endPage < totalPages) onPageChange(endPage + 1);
    };

    return (
        <div className="flex flex-row flex-nowrap justify-center items-center space-x-2">
            {startPage > 1 && (
                <button
                    onClick={handlePrevGroup}
                    className="px-2 py-1 border rounded transition-colors duration-200 bg-white text-gray-700 hover:bg-gray-200 text-sm whitespace-nowrap"
                >
                    이전
                </button>
            )}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-2 py-1 border rounded transition-colors duration-200 text-sm whitespace-nowrap ${page === currentPage
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    {page}
                </button>
            ))}
            {endPage < totalPages && (
                <button
                    onClick={handleNextGroup}
                    className="px-2 py-1 border rounded transition-colors duration-200 bg-white text-gray-700 hover:bg-gray-200 text-sm whitespace-nowrap"
                >
                    다음
                </button>
            )}
        </div>
    );
};

export default Pagination;
