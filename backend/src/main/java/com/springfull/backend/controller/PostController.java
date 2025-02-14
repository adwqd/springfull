package com.springfull.backend.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.service.PostService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@RequestMapping
@Log4j2
public class PostController {
	
	private final PostService postService;
	
	@PostMapping("/read")
	public PostDetailDTO read(@RequestBody HashMap<String, Integer> map) {
		return postService.read(map.get("post_no"));
	}
}
