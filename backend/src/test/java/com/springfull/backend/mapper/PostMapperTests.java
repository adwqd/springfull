package com.springfull.backend.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.ReplyDTO;
import com.springfull.backend.domain.ReportDTO;
import com.springfull.backend.domain.TagVO;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class PostMapperTests {
	
	@Autowired
	PostMapper postMapper;
	
	@Test
	public void testRead() {
		log.info(postMapper.read(10));
	}
	
	@Test
	public void testGetCate() {
		log.info(postMapper.getCate(13));
	}
	
	@Test
	public void testGetBrand() {
		log.info(postMapper.getBrand(13));
	}
	
	@Test
	public void testGetTaste() {
		log.info(postMapper.getTaste(13));
	}
	
	@Test
	public void testGetIngredient() {
		log.info(postMapper.getIngredient(13));
	}
	
	@Test
	public void testIsBookMarked() {
		log.info(postMapper.isBookMarked(1, "aaa"));
	}
	
	@Test
	public void testGetImage() {
		log.info(postMapper.getImage(18));
	}
	
	@Test
	public void testWriteReply() {
		postMapper.writeReply(ReplyDTO.builder().reply_content("댓글입니다.").post_no(32).member_uuid("aaa").build());
	}
	
	@Test
	public void testGetReply() {
		for(ReplyDTO temp:postMapper.getReply(1)) {
			log.info(temp);
		}
	}
	
	@Test
	public void testInsertStar() {
		postMapper.insertStar(32, "aaa", (double) 4);
	}
	
	@Test
	public void testGetStar() {
		log.info(postMapper.getStar(2, null));
	}
	
	@Test
	public void testUpdateStar() {
		postMapper.updateStar(1,3);
	}
	
	@Test
	public void testReplyLike() {
		postMapper.replyLike(5, "ccc");
	}
	
	@Test
	public void testReplyLikeCheck() {
		log.info(postMapper.replyLikeCheck(2, "aaa"));
	}
	
	@Test
	public void testReplyLikeUpdate() {
		postMapper.replyLikeUpdate(2);
	}
	
	@Test
	public void testModReply() {
		postMapper.modReply(ReplyDTO.builder().reply_no(1).reply_content("크리스탈리리").member_uuid("aaa").build());
	}
	
	@Test
	public void testDeleteReplyLike() {
		postMapper.deleteReplyLike(2);
	}
	
	@Test
	public void testDeleteReply() {
		postMapper.deleteReply(2);
	}
	
	@Test
	public void testReportType() {
		for(TagVO temp : postMapper.reportType()) {
			log.info(temp);
		}
	}
	
	@Test
	public void testReport() {
		postMapper.report(ReportDTO.builder().report_type(1).content("보기싫음").post_no(1).member_uuid("aaa").build());
	}
	
	@Test
	public void testPostLike() {
		log.info(postMapper.getPostLike(1));
	}
	
	@Test
	public void testUpdateState() {
		postMapper.updateState(2, 1);
	}
	
	@Test
	public void testModPost() {
		postMapper.modPost(PostDetailDTO.builder().post_no(12).title("수정").cost(4321).content("수정내용").build());
	}
	
	

}
