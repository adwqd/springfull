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
import org.springframework.web.bind.annotation.RestController;

import com.springfull.backend.domain.ImageDTO;
import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.ReportDTO;
import com.springfull.backend.domain.UserDTO;
import com.springfull.backend.service.AdminService;
import com.springfull.backend.service.PostService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Log4j2
public class AdminController {
	
	private final AdminService adminService;
	private final PostService postService;
	@Value("${com.springfull.upload.path}")
	private String uploadPath;
	
	@PostMapping("/board")
	public PageResponseDTO<PostDTO> allPost(@RequestBody PageRequestDTO pageRequestDTO){
		log.info("모든글 보기");
		return adminService.allPost(pageRequestDTO);
	}
	
	@PostMapping("/user")
	public PageResponseDTO<UserDTO> userList(@RequestBody PageRequestDTO pageRequestDTO){
		log.info("유저목록 보기");
		return adminService.userList(pageRequestDTO);
	}
	
	@GetMapping("/read/{post_no}")
	public PostDetailDTO read(@PathVariable("post_no") int post_no) {
		return adminService.read(post_no);
	}
	
	@PutMapping("/userstate")
	public void changeUserState(@RequestBody HashMap<String, String> map) {
		adminService.changeUserState(map.get("member_uuid"), Integer.parseInt(map.get("state")));
	}
	
	@PostMapping("/report")
	public PageResponseDTO<ReportDTO> reportList(@RequestBody PageRequestDTO pageRequestDTO) {
		return adminService.reportList(pageRequestDTO);
	}
	
	@PutMapping("/poststate")
	public void changePostState(@RequestBody HashMap<String, Integer> map) {
		adminService.changePostState(map.get("post_no"), map.get("state"));
	}
	
	@DeleteMapping("/post/{post_no}")
	public String deletePost(@PathVariable("post_no") int post_no) {
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
		return "성공";
	}
	
	@DeleteMapping("/reply/{reply_no}")
	public void deleteReply(@PathVariable("reply_no") int reply_no) {
		postService.deleteReply(reply_no);
	}

}
