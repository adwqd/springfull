package com.springfull.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class PostServiceTests {
	
	@Autowired
	PostService postService;
	
	@Test
	public void testRead() {
		log.info(postService.read(13, "aaa"));
	}
	
	@Test
	public void testLike() {
		postService.like(4);
	}
}
