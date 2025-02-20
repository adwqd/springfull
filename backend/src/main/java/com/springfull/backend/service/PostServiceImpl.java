package com.springfull.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.ReplyDTO;
import com.springfull.backend.domain.ReportDTO;
import com.springfull.backend.domain.TagVO;
import com.springfull.backend.mapper.PostMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;


@Service
@RequiredArgsConstructor
@Log4j2
public class PostServiceImpl implements PostService {
	
	private final PostMapper postMapper;

	@Override
	public PostDetailDTO read(int post_no, String member_uuid) {
		PostDetailDTO postDetailDTO = postMapper.read(post_no);
		if(postDetailDTO !=null) {
			postDetailDTO.setBrand_id(postMapper.getBrand(post_no));
			postDetailDTO.setCate_id(postMapper.getCate(post_no));
			postDetailDTO.setTaste_id(postMapper.getTaste(post_no));
			postDetailDTO.setIngredient_id(postMapper.getIngredient(post_no));
			if(postMapper.isBookMarked(post_no, member_uuid)!=null) {
				postDetailDTO.setBookmark(true);
			}
			postDetailDTO.setStar(postMapper.getMyStar(post_no, member_uuid));
			postDetailDTO.setImage(postMapper.getImage(post_no));
		}
		return postDetailDTO;
	}

	@Override
	public int like(int post_no) {
		Integer record_no = postMapper.like_check(post_no);
		if(record_no!=null) {
			postMapper.like_plus(record_no);
		}else {
			postMapper.new_like(post_no);
		}
		int like = postMapper.getLike(post_no);
		postMapper.like_update(post_no, like);
		return like;
	}

	@Override
	public void writeReply(ReplyDTO replyDTO) {
		postMapper.writeReply(replyDTO);		
	}

	@Override
	public List<ReplyDTO> getReply(int post_no) {
		return postMapper.getReply(post_no);
	}

	@Override
	public boolean replyLike(int reply_no, String member_uuid) {
		if(postMapper.replyLikeCheck(reply_no, member_uuid)==null) {
			postMapper.replyLike(reply_no, member_uuid);
			postMapper.replyLikeUpdate(reply_no);
			return true;
		}
		return false;
	}

	@Override
	public void insertStar(int post_no, String member_uuid, Double star) {
		Integer star_no = postMapper.getStar(post_no, member_uuid);
		if(star_no!=null) {
			postMapper.updateStar(star_no, star);
		}else {
			postMapper.insertStar(post_no, member_uuid, star);
		}
	}

	@Override
	public int modReply(ReplyDTO replyDTO) {
		return postMapper.modReply(replyDTO);
	}

	@Override
	public void bookMark(int post_no, String member_uuid) {
		Integer bookmark_no = postMapper.isBookMarked(post_no, member_uuid);
		if(bookmark_no == null) {
			postMapper.bookMark(post_no, member_uuid);
		}else {
			postMapper.deleteBookMark(bookmark_no);
		}
	}

	@Override
	public void deleteReply(int reply_no) {
		postMapper.deleteReplyLike(reply_no);
		postMapper.deleteReply(reply_no);
	}

	@Override
	public List<TagVO> reportType() {
		// TODO Auto-generated method stub
		return postMapper.reportType();
	}

	@Override
	public void report(ReportDTO reportDTO) {
		postMapper.report(reportDTO);
		
	}

}
