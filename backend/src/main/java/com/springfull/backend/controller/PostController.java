package com.springfull.backend.controller;


import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.springfull.backend.domain.ImageDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.ReplyDTO;
import com.springfull.backend.domain.ReportDTO;
import com.springfull.backend.domain.TagVO;
import com.springfull.backend.service.PostService;
import com.springfull.backend.util.JWTUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@RequestMapping
@Log4j2
public class PostController {
	
	private final PostService postService;
	private final JWTUtil jwtUtil;
	@Value("${com.springfull.upload.path}")
	private String uploadPath;
	
	@GetMapping("/read")
	public PostDetailDTO read(@RequestParam("post_no") int post_no, @RequestParam("member_uuid") String member_uuid) {
		return postService.read(post_no, member_uuid);
	}
	
	@GetMapping("/post-like/{post_no}")
	public int post_like(@PathVariable("post_no") int post_no) {
		return postService.like(post_no);
	}
	
	@PostMapping("/member/reply")
	public void writeReply(@RequestBody ReplyDTO replyDTO, HttpServletRequest httpServletRequest) {
		String accessToken = jwtUtil.getAccessToken(httpServletRequest);
		String uuid = jwtUtil.getUUID(accessToken);
		replyDTO.setMember_uuid(uuid);
		postService.writeReply(replyDTO);
	}
	
	@GetMapping("/reply/{post_no}")
	public List<ReplyDTO> reply(@PathVariable("post_no") int post_no){
		return postService.getReply(post_no);
	}
	
	@PostMapping("/member/replylike")
	public Boolean replyLike(@RequestBody ReplyDTO replyDTO, HttpServletRequest httpServletRequest) {
		String accessToken = jwtUtil.getAccessToken(httpServletRequest);
		String uuid = jwtUtil.getUUID(accessToken);
		return postService.replyLike(replyDTO.getReply_no(), uuid);
	}
	
	@PostMapping("/member/star")
	public void star(@RequestBody HashMap<String, String> map, HttpServletRequest httpServletRequest) {
		String accessToken = jwtUtil.getAccessToken(httpServletRequest);
		String uuid = jwtUtil.getUUID(accessToken);
		int post_no = Integer.parseInt(map.get("post_no"));
		Double star = Double.parseDouble(map.get("star"));
		postService.insertStar(post_no, uuid, star);
	}
	
	@PutMapping("/member/reply")
	public int modReply(@RequestBody ReplyDTO replyDTO, HttpServletRequest httpServletRequest) {
		String accessToken = jwtUtil.getAccessToken(httpServletRequest);
		String uuid = jwtUtil.getUUID(accessToken);
		replyDTO.setMember_uuid(uuid);
		return postService.modReply(replyDTO);
	}
	
	@GetMapping("/member/bookmark/{post_no}")
	public void bookmark(@PathVariable("post_no") int post_no, HttpServletRequest httpServletRequest) {
		String accessToken = jwtUtil.getAccessToken(httpServletRequest);
		String uuid = jwtUtil.getUUID(accessToken);
		postService.bookMark(post_no, uuid);
	}
	
	@DeleteMapping("/member/reply/{reply_no}")
	public void deleteReply(@PathVariable("reply_no") int reply_no) {		
		postService.deleteReply(reply_no);
	}
	
	@GetMapping("/member/reporttype")
	public List<TagVO> reportType(){
		return postService.reportType();
	}
	
	@PostMapping("/member/report")
	public void report(@RequestBody ReportDTO reportDTO) {
		postService.report(reportDTO);
	}
	
	@DeleteMapping("/member/post/{post_no}")
	public String deletePost(@PathVariable("post_no") int post_no, HttpServletRequest httpServletRequest) {
		String accessToken = jwtUtil.getAccessToken(httpServletRequest);
		String uuid = jwtUtil.getUUID(accessToken);
		if(!uuid.equals(postService.read(post_no, uuid).getMember_uuid())) {
			log.info("본인이 아니잖아");
			return "본인 글만 삭제할수 있습니다";
		}
		if(postService.likeCheck(post_no)) {
			List<ImageDTO> list = postService.getImage(post_no);
			if(list!=null && list.size()>0) {
				for(ImageDTO image:list) {
					String link = image.getLink();
					Resource resource = new FileSystemResource(uploadPath+File.separator+link);
					try {resource.getFile().delete();} catch (IOException e) {e.printStackTrace();}
					resource = new FileSystemResource(uploadPath+File.separator+"s_"+link);
					try {resource.getFile().delete();} catch (IOException e) {e.printStackTrace();}
				}
			}
			postService.deletePost(post_no);
			return null;
		}
		return "좋아요가 너무 많습니다.";
	}
	
	@PutMapping("/member/post")
	public void modPost(@RequestBody PostDetailDTO postDetailDTO) {
		int post_no = postDetailDTO.getPost_no();
		if(postService.likeCheck(post_no)) {
			List<ImageDTO> list = postService.getImage(post_no);
			if(list!=null && list.size()>0) {
				for(ImageDTO image:list) {
					String link = image.getLink();
					Resource resource = new FileSystemResource(uploadPath+File.separator+link);
					try {resource.getFile().delete();} catch (IOException e) {e.printStackTrace();}
					resource = new FileSystemResource(uploadPath+File.separator+"s_"+link);
					try {resource.getFile().delete();} catch (IOException e) {e.printStackTrace();}
				}
			}
			postService.modPost(postDetailDTO);
		}
	}
	
}
