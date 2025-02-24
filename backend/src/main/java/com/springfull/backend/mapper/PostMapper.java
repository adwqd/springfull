package com.springfull.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.springfull.backend.domain.ImageDTO;
import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.ReplyDTO;
import com.springfull.backend.domain.ReportDTO;
import com.springfull.backend.domain.TagVO;

@Mapper
public interface PostMapper {
	
	//글 상세보기
	PostDetailDTO read(@Param("post_no") int post_no);
	
	//카테고리
	List<Integer> getCate(@Param("post_no") int post_no);
	//브랜드
	List<Integer> getBrand(@Param("post_no") int post_no);
	//맛
	List<Integer> getTaste(@Param("post_no") int post_no);
	//재료
	List<Integer> getIngredient(@Param("post_no") int post_no);
	
	//좋아요 체크
	Integer like_check(@Param("post_no") int post_no);
	//새로운 좋아요
	void new_like(@Param("post_no") int post_no);
	//기존 좋아요
	void like_plus(@Param("record_no") int record_no);
	//좋아요 갯수 총합 얻기
	Integer getLike(@Param("post_no") int post_no);
	//좋아요 갯수 반영하기
	void like_update(@Param("post_no") int post_no, @Param("like") int like);
	
	//북마크여부 확인
	Integer isBookMarked(@Param("post_no") int post_no, @Param("member_uuid") String member_uuid);
	//북마크하기
	Integer bookMark(@Param("post_no") int post_no, @Param("member_uuid") String member_uuid);
	//북마크 지우기
	void deleteBookMark(@Param("bookmark_no") int bookmark_no);
	
	//별점번호 가져오기
	Integer getStar(@Param("post_no") int post_no, @Param("member_uuid") String member_uuid);
	//내 별점
	Double getMyStar(@Param("post_no") int post_no, @Param("member_uuid") String member_uuid);
	//별점 매기기
	Integer insertStar(@Param("post_no") int post_no, @Param("member_uuid") String member_uuid, @Param("star") double star);
	//별점 업데이트
	void updateStar(@Param("star_no") int star_no, @Param("star") double star);
	
	//이미지 불러오기
	List<ImageDTO> getImage(@Param("post_no") int post_no);
	
	//댓글 쓰기
	void writeReply(ReplyDTO replyDTO);
	//댓글 가져오기
	List<ReplyDTO> getReply(@Param("post_no") int post_no);
	//댓글 좋아요 여부 체크
	Integer replyLikeCheck(@Param("reply_no") int reply_no, @Param("member_uuid") String member_uuid);
	//댓글 좋아요
	void replyLike(@Param("reply_no") int reply_no, @Param("member_uuid") String member_uuid);
	//댓글 좋아요 업데이트
	void replyLikeUpdate(@Param("reply_no") int reply_no);
	//댓글 수정
	int modReply(ReplyDTO replyDTO);
	//댓글 좋아요 삭제
	void deleteReplyLike(@Param("reply_no") int reply_no);
	//댓글 삭제
	void deleteReply(@Param("reply_no") int reply_no);
	//댓글 하나 읽기
	ReplyDTO readReply(@Param("reply_no") int reply_no);
	
	//신고 종류
	List<TagVO> reportType(); 
	//신고하기
	void report(ReportDTO reportDTO);
	
	int getPostLike(@Param("post_no") int post_no);
	//상태변경
	void updateState(@Param("post_no") int post_no, @Param("state") int state);
	
	void modPost(PostDetailDTO postDetailDTO);
}
