package com.springfull.backend.service;

import java.util.ArrayList;
import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.springfull.backend.domain.PostDetailDTO;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class RegisterServiceTests {
	
	@Autowired
	RegisterService registerService;
	
	@Test
	public void registerTest() {
		PostDetailDTO postDetailDTO = PostDetailDTO.builder()
				.title("서비스테스트")
				.cost(70000)
				.content("서비스테스트콘텐츠")
				.brand_id(new ArrayList<>(Arrays.asList(1)))
				.taste_id(new ArrayList<>(Arrays.asList(1,3)))
				.ingredient_id(new ArrayList<>(Arrays.asList(1,4,7)))
				.member_uuid("aaa").build();
		log.info(registerService.register(postDetailDTO));
	}
	
	@Test
	public void testGetIngredientVO() {
		log.info(registerService.getIngredientVO(new ArrayList<>(Arrays.asList(1,5))));
	}
}
