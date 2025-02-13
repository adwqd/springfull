package com.springfull.backend.mapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.springfull.backend.domain.PageRequestDTO;

import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
public class ListMapperTests {
	
	@Autowired
	private ListMapper listMapper;
	
	
	
	@Test
	public void testGetCount() {
		List<Integer> aa = new ArrayList<>(Arrays.asList(1));
		PageRequestDTO pageRequestDTO = new PageRequestDTO();
		pageRequestDTO.setBrand(aa);
		log.info(listMapper.getCount(pageRequestDTO));
	}
	

	
	@Test
	public void testSearch() {
		List<Integer> aa = new ArrayList<>(Arrays.asList(1));
		PageRequestDTO pageRequestDTO = new PageRequestDTO();
		pageRequestDTO.setBrand(aa);
		log.info(pageRequestDTO);
		log.info("aaaaa"+listMapper.search(pageRequestDTO));
	}
	
	@Test
	public void getThumbnail() {
		log.info(listMapper.getThumbnail(2));
	}
	
	@Test
	public void testGetStar() {
		log.info(listMapper.getStar(3));
	}
	
	@Test
	public void testCateSearch() {
		log.info(listMapper.cateSearch(new ArrayList<>(Arrays.asList(1,2))));
	}
}
