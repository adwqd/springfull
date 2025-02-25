package com.springfull.backend.util;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class JWTUtilTests {
	
	@Autowired
	JWTUtil jwtUtil;
	
	@Test
	public void testGenerateToken() {
		Map<String, Object> map = new HashMap<>();
		map.put("aaa", "aaa");
		map.put("bbb", "ccc");
		log.info(jwtUtil.generateToken("aaa", "bbb", "0"));
	}
	
	@Test
	public void testValidate() {
		String token = 
				"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJfdXVpZCI6ImFhYSIsIm5hbWUiOiJiYmIiLCJpYXQiOjE3NDA0NDIzOTYsImV4cCI6MTc0MDQ1MzE5Nn0.rQc8_YGnwfXohyIZ5QtFsXK-wJYEHhSPok9KgdQVg0M";
		boolean claim = jwtUtil.validateToken(token);
		log.info(claim);
	}
	
	@Test
	public void testGetUUID() {
		String token = 
				"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJfdXVpZCI6ImFhYSIsIm5hbWUiOiJiYmIiLCJzdGF0ZSI6IjAiLCJpYXQiOjE3NDA0NTMxNDgsImV4cCI6MTc0MDQ2Mzk0OH0.Qd8ck22eicACGhpdXhHrYI5dfWqIhnBEDSgBAul5weA";
		log.info(jwtUtil.getUUID(token));
		
	}
	
	@Test
	public void testGetName() {
		String token = 
				"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJfdXVpZCI6ImFhYSIsIm5hbWUiOiJiYmIiLCJpYXQiOjE3NDA0NDIzOTYsImV4cCI6MTc0MDQ1MzE5Nn0.rQc8_YGnwfXohyIZ5QtFsXK-wJYEHhSPok9KgdQVg0M";
		log.info(jwtUtil.getName(token));
		
	}
}
