package com.springfull.backend.service;

import java.util.List;

import com.springfull.backend.domain.ImageDTO;
import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.ReplyDTO;
import com.springfull.backend.domain.ReportDTO;
import com.springfull.backend.domain.TagVO;

public interface PostService {
	PostDetailDTO read(int post_no, String member_uuid);
	
	int like(int post_no);
	
	void writeReply(ReplyDTO replyDTO);
	
	List<ReplyDTO> getReply(int post_no);
	
	boolean replyLike(int reply_no, String member_uuid);
	
	void insertStar(int post_no, String member_uuid, Double star);
	
	int modReply(ReplyDTO replyDTO);
	
	void bookMark(int post_no, String member_uuid);
	
	void deleteReply(int reply_no);
	
	List<TagVO> reportType();
	
	void report(ReportDTO reportDTO);
	
	void deletePost(int post_no);
	
	List<ImageDTO> getImage(int post_no);
	
	boolean likeCheck(int post_no);
	
	void modPost(PostDetailDTO postDetailDTO);
}
