package com.springfull.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.springfull.backend.domain.PostDTO;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class BoardServiceTests {
	
	@Autowired
	BoardService boardService;
	
	@Test
	public void testCateBest() {
		for(PostDTO temp:boardService.cateBest()) {
			log.info(temp);
		}
	}
	
	@Test
	public void testRecent() {
		for(PostDTO temp:boardService.recent()) {
			log.info(temp);
		}
	}
}
