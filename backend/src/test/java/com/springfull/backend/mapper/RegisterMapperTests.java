package com.springfull.backend.mapper;




import java.util.ArrayList;
import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.springfull.backend.domain.PostDetailDTO;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class RegisterMapperTests {
	
	@Autowired
	RegisterMapper registerMapper;
	
	@Test
	public void testGetCate() {
		log.info(registerMapper.getCate());
	}
	
	@Test
	public void testGetBrand() {
		log.info(registerMapper.getBrand(new ArrayList<>(Arrays.asList(1,2))));
	}
	
	@Test
	public void testGetTaste() {
		log.info(registerMapper.getTaste());
	}
	
	@Test
	public void testGetIngredient() {
		log.info(registerMapper.getIngredient(new ArrayList<>(Arrays.asList(1,2))));
	}
	
	@Test
	public void testRegister() {
		PostDetailDTO postDetailDTO = PostDetailDTO.builder()
				.title("title")
				.cost(7000)
				.content("content")
				.member_uuid("ccc").build();
		registerMapper.register(postDetailDTO);
		log.info(postDetailDTO.getPost_no());
	}
	
	@Test
	public void testInsertBrand() {
		registerMapper.inputBrand(0, 5);		
	}
	
	@Test
	public void testInsertTaste() {
		registerMapper.inputTaste(5, 5);
	}
	
	@Test
	public void testInsertIngredient() {
		registerMapper.inputIngredient(10, 4);
	}

}
