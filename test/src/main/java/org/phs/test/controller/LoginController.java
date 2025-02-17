package org.phs.test.controller;

import java.util.Map;

import org.phs.test.kakao.KakaoApi;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class LoginController {
	
	private final KakaoApi kakaoApi;
	
	@GetMapping("/kakao/callback")
	public String login(HttpSession session, @RequestParam String code) {
		// 1. 인가 코드 받기 (@RequestParam String code)

        // 2. 토큰 받기
        String accessToken = kakaoApi.getAccessToken(code);

        // 3. 사용자 정보 받기
        Map<String, Object> userInfo = kakaoApi.getUserInfo(accessToken);

        String email = (String)userInfo.get("email");
        String nickname = (String)userInfo.get("nickname");

        System.out.println("email = " + email);
        System.out.println("nickname = " + nickname);
        System.out.println("accessToken = " + accessToken);
        
        session.setAttribute("nickname", nickname);
        session.setAttribute("accessToken", accessToken);
        
		return "redirect:http://192.168.4.10:5173/list";
	}
	
	
	
}
