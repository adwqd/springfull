package com.springfull.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PostDTO;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class AdminServiceTests {
	
	@Autowired
	AdminService adminService;
	
	@Test
	public void testAllPost() {
		for(PostDTO temp:adminService.allPost(PageRequestDTO.builder().keyword("제목").build()).getDtoList()) {
			log.info(temp);
		}
	}
	
	@Test
	public void testUserList() {
		log.info(adminService.userList(PageRequestDTO.builder().build()).getDtoList());
	}
	
	@Test
	public void testRead() {
		log.info(adminService.read(4));
	}
	
	@Test
	public void testReportList() {
		log.info(adminService.reportList(PageRequestDTO.builder().keyword("AA").build()));
	}
}
