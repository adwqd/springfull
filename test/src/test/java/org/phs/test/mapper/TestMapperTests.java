package org.phs.test.mapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class TestMapperTests {
	
	@Autowired
	TestMapper testMapper;
	
	@Test
	public void testGetStudent() {
		log.info(testMapper.getStudent1());
	}
}
