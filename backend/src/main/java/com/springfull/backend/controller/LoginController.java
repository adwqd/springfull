package com.springfull.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.springfull.backend.domain.UserDTO;
import com.springfull.backend.kakao.KakaoApi;
import com.springfull.backend.service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class LoginController {
	
	private final KakaoApi kakaoApi;
	private final UserService userService;
	
	@GetMapping("/kakao/callback")
	public HashMap<String, String> login(HttpSession session, @RequestParam("code") String code) {
		// 1. 인가 코드 받기 (@RequestParam String code)

        // 2. 토큰 받기
        String accessToken = kakaoApi.getAccessToken(code);

        // 3. 사용자 정보 받기
        Map<String, Object> userInfo = kakaoApi.getUserInfo(accessToken);
        String nickname = (String) userInfo.get("nickname");
        UserDTO userDTO = UserDTO.builder().user_id((String)userInfo.get("id")).name(nickname).build();
        String member_uuid =userService.login(userDTO);
        
        System.out.println("nickname = " + nickname);
        System.out.println("accessToken = " + accessToken);
        System.out.println(member_uuid+"이거다");
        HashMap<String, String> map = new HashMap<>();
        map.put("member_uuid", member_uuid);
        map.put("accessToken", "액세스 토큰 만들어서 쏴주기");
        
		return map;
	}
	
	
	
}
