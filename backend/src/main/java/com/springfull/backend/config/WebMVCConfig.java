package com.springfull.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.springfull.backend.util.AdminInterceptor;
import com.springfull.backend.util.MemberInterceptor;
import com.springfull.backend.util.TokenInterceptor;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class WebMVCConfig implements WebMvcConfigurer {
	
	private final MemberInterceptor memberInterceptor;
	private final AdminInterceptor adminInterceptor;
	private final TokenInterceptor tokenInterceptor;
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(memberInterceptor)
				.addPathPatterns("/member/*");
		
		registry.addInterceptor(adminInterceptor)
		.addPathPatterns("/admin/*");
		
		registry.addInterceptor(tokenInterceptor)
		.addPathPatterns("/token/*");
	}

	
}
