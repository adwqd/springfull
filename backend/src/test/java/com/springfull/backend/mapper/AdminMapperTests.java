package com.springfull.backend.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.domain.UserDTO;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class AdminMapperTests {
	
	@Autowired
	AdminMapper adminMapper;
	
	@Test
	public void testAllPost() {
		for(PostDTO temp:adminMapper.allPost(PageRequestDTO.builder().keyword("김치").build())) {
			log.info(temp);
		}
	}
	
	
	@Test
	public void testAllPostCount() {
		log.info(adminMapper.allPostCount(PageRequestDTO.builder().keyword("김치").build()));
	}
	
	@Test
	public void testUserList() {
		for(UserDTO temp:adminMapper.userList(PageRequestDTO.builder().keyword("aaa").build())) {
			log.info(temp);
		}
	}
	
	@Test
	public void testUserCount() {
		log.info(adminMapper.userCount(PageRequestDTO.builder().build()));
	}
	
	@Test
	public void testRead() {
		log.info(adminMapper.read(26));
	}
	
	@Test
	public void testChangeState() {
		adminMapper.changeState("aaa", 1);
	}
	
	@Test
	public void testReportList() {
		log.info(adminMapper.reportList(PageRequestDTO.builder().keyword("ㅁㅁ").build()));
	}
	
	@Test
	public void testReportCount() {
		log.info(adminMapper.reportCount(PageRequestDTO.builder().keyword("보기").build()));
	}
	
	
	
	
}
