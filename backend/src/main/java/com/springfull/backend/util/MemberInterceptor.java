package com.springfull.backend.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Component
public class MemberInterceptor implements HandlerInterceptor {
	
	private final JWTUtil jwtUtil;
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception{
		String uri = request.getRequestURI();
		log.info("uri:"+uri);
		
		String accessToken = jwtUtil.getAccessToken(request);
		log.info("액세스토큰:"+accessToken);
		
		String requestURI = request.getRequestURI();
		if(accessToken == null) {
			log.info("비회원 유저입니다. URI : {}", requestURI);
			response.setStatus(401);  // 401 상태 코드 설정
	        response.getWriter().write("Authorization header is missing.");
			return false;
		}else {
			log.debug("토큰이 존재합니다.");
			if(jwtUtil.validateToken(accessToken)) {
				log.info("유효한 토큰입니다. URI : {}", requestURI);
				return true;
			}else {
				log.info("유효하지 않은 토큰입니다. URI : {}", requestURI);
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // 401 상태 코드 설정
		        response.getWriter().write("Authorization header is invalid.");
				return false;
			}
		}
		
	}
}
