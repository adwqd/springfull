package com.springfull.backend.controller;


import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.ReplyDTO;
import com.springfull.backend.service.PostService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@RequestMapping
@Log4j2
public class PostController {
	
	private final PostService postService;
	
	@GetMapping("/read")
	public PostDetailDTO read(@RequestParam("post_no") int post_no, @RequestParam("member_uuid") String member_uuid) {
		return postService.read(post_no, member_uuid);
	}
	
	@GetMapping("/post-like/{post_no}")
	public int post_like(@PathVariable("post_no") int post_no) {
		return postService.like(post_no);
	}
	
	@PostMapping("/reply")
	public void writeReply(@RequestBody ReplyDTO replyDTO) {
		postService.writeReply(replyDTO);
	}
	
	@GetMapping("/reply/{post_no}")
	public List<ReplyDTO> reply(@PathVariable("post_no") int post_no){
		return postService.getReply(post_no);
	}
	
	@PostMapping("/replylike")
	public Boolean replyLike(@RequestBody ReplyDTO replyDTO) {
		return postService.replyLike(replyDTO.getReply_no(), replyDTO.getMember_uuid());
	}
	
}
