import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ReportedPosts = () => {
    const navigate = useNavigate();

    // 신고된 게시글 데이터 상태
    const [reports, setReports] = useState([]);
    const [filter, setFilter] = useState("전체"); // 🚀 정렬 상태 ("전체", "대기중", "처리완료")

    // 🚀 1. 신고 데이터 가져오기 (API 연결 가능)
    useEffect(() => {
        const fetchReports = async () => {
            try {
                // ❌ 백엔드 API 연결 예시 (현재는 더미 데이터 사용)
                // const response = await fetch("/api/reports");
                // const data = await response.json();
                const dummyReports = [
                    {
                        reportId: 1,
                        postId: 101,
                        title: "서브웨이 우즈정식 조합",
                        reportReason: "부적절한 내용",
                        customReason: "",
                        reportDate: "2025-02-26",
                        postOwner: "user123",
                        status: "삭제"
                    },
                    {
                        reportId: 2,
                        postId: 102,
                        title: "연세우유 생크림빵 조합",
                        reportReason: "허위 정보",
                        customReason: "",
                        reportDate: "2025-02-25",
                        postOwner: "user234",
                        status: "정상"
                    }
                ];
                setReports(dummyReports);
            } catch (error) {
                console.error("신고 데이터 불러오기 실패:", error);
            }
        };

        fetchReports();
    }, []);

    // 🚀 2. 신고 상세 보기 (게시글 상세 페이지로 이동)
    const handleViewDetails = (postId) => {
        navigate(`/posts/${postId}`);
    };

    // 🚀 3. 신고 처리 상태 업데이트
    const handleUpdateStatus = (reportId) => {
        setReports((prevReports) =>
            prevReports.map((report) =>
                report.reportId === reportId
                    ? { ...report, status: report.status === "정상" ? "삭제" : "정상" }
                    : report
            )
        );
    };

    // 🚀 4. 신고 목록 필터링 (처리완료 & 대기중)
    const filteredReports = reports.filter((report) =>
        filter === "전체" ? true : report.status === filter
    );

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-center">신고 게시판 🔔</h2>
                {/* 🔹 뒤로 가기 버튼 */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                    <FaArrowLeft />
                    <span className="text-sm">뒤로 가기</span>
                </button>
            </div>
            {/* 🔹 필터 드롭다운 (셀렉트 박스) */}
            <div className="flex justify-end">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700"
                >
                    <option value="전체">전체</option>
                    <option value="정상">정상</option>
                    <option value="삭제">삭제</option>
                </select>
            </div>

            <div className="border p-3 shadow-md rounded-xl">
                {/* 신고된 게시글 목록 */}
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2 text-left">게시글 제목</th>
                            <th className="p-2">신고 사유</th>
                            <th className="p-2">작성자</th>
                            <th className="p-2">상태</th>
                            <th className="p-2">액션</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.map((report) => (
                            <tr key={report.reportId} className="border-b text-center">
                                {/* 게시글 제목 클릭하면 상세 페이지로 이동 */}
                                <td
                                    className="p-2 text-left text-blue-600 cursor-pointer hover:underline text-xs"
                                    onClick={() => handleViewDetails(report.postId)}
                                >
                                    {report.title}
                                </td>
                                <td className="p-2 text-xs">{report.customReason || report.reportReason}</td>
                                <td className="p-2 text-xs">{report.postOwner}</td>
                                <td className={`p-2 font-bold text-xs ${report.status === "삭제" ? "text-red-500" : "text-green-600"}`}>
                                    {report.status}
                                </td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleUpdateStatus(report.reportId)}
                                        className={`px-2 py-1 text-xs rounded-md text-gray-700 ${report.status === "정상" ? "bg-red-300" : " bg-gray-300"
                                            }`}
                                    >
                                        {report.status === "정상" ? "삭제처리" : "정상처리"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default ReportedPosts;
