package com.springfull.backend.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class PostMapperTests {
	
	@Autowired
	PostMapper postMapper;
	
	@Test
	public void testRead() {
		log.info(postMapper.read(10));
	}
	
	@Test
	public void testGetCate() {
		log.info(postMapper.getCate(13));
	}
	
	@Test
	public void testGetBrand() {
		log.info(postMapper.getBrand(13));
	}
	
	@Test
	public void testGetTaste() {
		log.info(postMapper.getTaste(13));
	}
	
	@Test
	public void testGetIngredient() {
		log.info(postMapper.getIngredient(13));
	}
	
	@Test
	public void testIsBookMarked() {
		log.info(postMapper.isBookMarked(1, "aaa"));
	}
}
