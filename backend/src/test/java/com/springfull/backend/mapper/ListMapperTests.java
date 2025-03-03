package com.springfull.backend.mapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PostDTO;

import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
public class ListMapperTests {
	
	@Autowired
	private ListMapper listMapper;
	
	
	
	@Test
	public void testGetCount() {
		List<Integer> aa = new ArrayList<>(Arrays.asList(1,2,3,4,5,6));
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
	
	@Test
	public void testHotRanking() {
		for(PostDTO temp:listMapper.hotRanking()) {
			log.info(temp);
		}
	}
	
	@Test
	public void testCateRanking() {
		for(PostDTO temp:listMapper.cateRanking(1, 10)) {
			log.info(temp);
		}
	}
	
	@Test
	public void testRecent() {
		for(PostDTO temp:listMapper.recent()) {
			log.info(temp);
		}
	}
}
