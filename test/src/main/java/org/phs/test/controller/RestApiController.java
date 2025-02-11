package org.phs.test.controller;

import java.util.HashMap;
import java.util.Map;

import org.phs.test.dto.StudentDTO;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestControllerAdvice
@RestController
@RequestMapping("/")
@Log4j2
@RequiredArgsConstructor
public class RestApiController {
	
	@Operation(description = "bbb test")
	@GetMapping("/aaa")
	public Map<String, String> register(){
		Map<String, String> resultMap = new HashMap<>();
		StudentDTO studentDTO = StudentDTO.builder().stu_id("1").stu_name("김철수").build();
		resultMap.put("bbb", "ababab");
		return resultMap;
	}
	
	@GetMapping("/api/session")
	public Map<String, String> apiSession(HttpSession session){
		Map<String, String> resultMap = new HashMap<>();
		String nickname = (String) session.getAttribute("nickname");
		String accessToken = (String) session.getAttribute("accessToken");
		log.info("aaa"+nickname);
		log.info("bbb"+accessToken);
		resultMap.put("nickname", nickname);
		resultMap.put("accessToken", accessToken);
		resultMap.put("bbb", "ababab");
		return resultMap;
	}
	
}
