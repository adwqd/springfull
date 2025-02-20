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
public class UserMapperTests {
	
	@Autowired
	public UserMapper userMapper;
	
	@Test
	public void testUpdateProfile() {
		userMapper.updateProfile(UserDTO.builder().member_uuid("c31880cc-4aee-470a-a574-6807427a3d16").name("흥석").description("아아아").build());
	}
	
	@Test
	public void testMyPost() {
		for(PostDTO temp: userMapper.myPost(PageRequestDTO.builder().keyword("제목").member_uuid("aaa").build())) {
			log.info(temp);
		}
	}
	
	@Test
	public void testGetMyPostCount(){
		log.info(userMapper.getMyPostCount(PageRequestDTO.builder().member_uuid("aaa").build()));
	}
	
	@Test
	public void testStarPost() {
		for(PostDTO temp: userMapper.starPost(PageRequestDTO.builder().member_uuid("aaa").build())) {
			log.info(temp);
		}
	}
	
	@Test
	public void testGetStarPostCount(){
		log.info(userMapper.getStarPostCount(PageRequestDTO.builder().member_uuid("aaa").build()));
	}
}
