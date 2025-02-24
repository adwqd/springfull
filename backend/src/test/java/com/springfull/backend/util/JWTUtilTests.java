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
		log.info(jwtUtil.generateToken("aaa", "bbb"));
	}
	
	@Test
	public void testValidate() {
		String token = 
				"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJfdXVpZCI6ImFhYSIsIm5hbWUiOiJiYmIiLCJpYXQiOjE3NDAzODY5MzMsImV4cCI6MTc0MDM5NzczM30.Daw63aL8hfaYqKoVoa1LHlrB4Ldmit4-l7nTlKbsKZ4";
		boolean claim = jwtUtil.validateToken(token);
		log.info(claim);
	}
	
	@Test
	public void testGetUUID() {
		String token = 
				"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJfdXVpZCI6ImFhYSIsIm5hbWUiOiJiYmIiLCJpYXQiOjE3NDAzODY5MzMsImV4cCI6MTc0MDM5NzczM30.Daw63aL8hfaYqKoVoa1LHlrB4Ldmit4-l7nTlKbsKZ4";
		log.info(jwtUtil.getUUID(token));
		
	}
}
