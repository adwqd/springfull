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
		log.info(jwtUtil.generateToken(map, 1));
	}
	
	@Test
	public void testValidate() {
		String token = 
				"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhYWEiOiJhYWEiLCJiYmIiOiJjY2MiLCJleHAiOjE3NDAxMTkxNTcsImlhdCI6MTc0MDAzMjc1N30.vuidKlm8-y_U0Rzkcj2VUo2r8iYl3Ly3_Ayc3ytruHw";
		Map<String, Object> claim = jwtUtil.validateToken(token);
		log.info(claim.get("aaa"));
		log.info(claim.get("bbb"));
	}
}
