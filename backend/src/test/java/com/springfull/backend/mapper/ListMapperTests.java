package com.springfull.backend.mapper;

import java.util.ArrayList;
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
	public void testBoardList() {
		List<Integer> aa = new ArrayList<>();
		aa.add(1);
		PageRequestDTO pageRequestDTO = new PageRequestDTO();
		pageRequestDTO.setBrand(aa);
		log.info("aaaaa"+listMapper.brandList(pageRequestDTO));
	}
	
	
	@Test
	public void testGetCount() {
		List<Integer> aa = new ArrayList<>();
		aa.add(1);
		PageRequestDTO pageRequestDTO = new PageRequestDTO();
		pageRequestDTO.setBrand(aa);
		log.info(listMapper.getCount(pageRequestDTO));
	}
}
