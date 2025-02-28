package com.springfull.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.springfull.backend.domain.ImageDTO;
import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.ReplyDTO;
import com.springfull.backend.domain.ReportDTO;
import com.springfull.backend.domain.TagVO;
import com.springfull.backend.mapper.PostMapper;
import com.springfull.backend.mapper.RegisterMapper;
import com.springfull.backend.mapper.RemoveMapper;
import com.springfull.backend.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;


@Service
@RequiredArgsConstructor
@Log4j2
public class PostServiceImpl implements PostService {
	
	private final PostMapper postMapper;
	private final UserMapper userMapper;
	private final RemoveMapper removeMapper;
	private final RegisterMapper registerMapper;

	@Override
	public PostDetailDTO read(int post_no, String member_uuid) {
		PostDetailDTO postDetailDTO = postMapper.read(post_no);
		if(postDetailDTO !=null) {
			postDetailDTO.setBrand_id(postMapper.getBrand(post_no));
			postDetailDTO.setCate_id(postMapper.getCate(post_no));
			postDetailDTO.setTaste(postMapper.getTasteTag(post_no));
			postDetailDTO.setIngredient(postMapper.getIngredientTag(post_no));
			if(member_uuid!=null) {
				if(postMapper.isBookMarked(post_no, member_uuid)!=null) {
					postDetailDTO.setBookmark(true);
				}
			}			
			postDetailDTO.setStar(postMapper.getMyStar(post_no, member_uuid));
			postDetailDTO.setImage(postMapper.getImage(post_no));
			postDetailDTO.setProfile_img(userMapper.viewProfile(postDetailDTO.getMember_uuid()));
			postDetailDTO.setName(userMapper.getUser(postDetailDTO.getMember_uuid()).getName());
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
		List<ReplyDTO> list = new ArrayList<>();
		for(ReplyDTO temp:postMapper.getReply(post_no)) {
			temp.setName(userMapper.getUser(temp.getMember_uuid()).getName());
			list.add(temp);
		}
		return list;
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

	@Override
	public void deletePost(int post_no) {
		removeMapper.deleteBrand(post_no);
		removeMapper.deleteTaste(post_no);
		removeMapper.deleteIngredient(post_no);
		removeMapper.deleteLike(post_no);
		removeMapper.deleteImage(post_no);
		removeMapper.deleteStar(post_no);
		removeMapper.deleteBookmark(post_no);
		removeMapper.deleteReport(post_no);
		List<Integer> replyList = removeMapper.getReply(post_no);
		if(replyList !=null) {
			for(int reply_no:replyList) {
				removeMapper.deleteReplyLike(reply_no);
			}
		}
		removeMapper.deleteReply(post_no);
		removeMapper.deletePost(post_no);
	}

	@Override
	public List<ImageDTO> getImage(int post_no) {
		
		return postMapper.getImage(post_no);
	}

	@Override
	public boolean likeCheck(int post_no) {
		if(postMapper.read(post_no).getPost_like()<50) {
			return true;
		}
		return false;
	}

	@Override
	public void modPost(PostDetailDTO postDetailDTO) {
		int post_no = postDetailDTO.getPost_no();
		removeMapper.deleteBrand(post_no);
		removeMapper.deleteTaste(post_no);
		removeMapper.deleteIngredient(post_no);
		removeMapper.deleteImage(post_no);
		postMapper.modPost(postDetailDTO);
		for(int brand:postDetailDTO.getBrand_id()) {
			registerMapper.inputBrand(brand, post_no);
		}
		for(int taste:postDetailDTO.getTaste_id()) {
			registerMapper.inputTaste(taste, post_no);
		}
		for(int ingredient:postDetailDTO.getIngredient_id()) {
			registerMapper.inputIngredient(ingredient, post_no);
		}
		if(postDetailDTO.getImage()!=null && postDetailDTO.getImage().size()>0) {
			int i=0;
			for(ImageDTO temp:postDetailDTO.getImage()) {
				temp.setOrd(i);
				temp.setPost_no(post_no);
				registerMapper.saveImage(temp);
				i++;
			}
		}
	}

}
