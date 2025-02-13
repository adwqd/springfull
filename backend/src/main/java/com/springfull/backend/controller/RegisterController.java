package com.springfull.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.TagDTO;
import com.springfull.backend.service.RegisterService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@RequestMapping
@Log4j2
public class RegisterController {
	
	private final RegisterService registerService;
	
	@PostMapping("/tag")
	public TagDTO tag(@RequestBody List<Integer> category){
		TagDTO tagDTO = TagDTO.builder()
				.category(registerService.getCategory())
				.brand(registerService.getBrandVO(category))
				.taste(registerService.getTasteVO())
				.ingredient(registerService.getIngredientVO(category))
				.build();
		return tagDTO;
	}
	
	@PostMapping("/register")
	public int register(@RequestBody PostDetailDTO postDetailDTO) {
		return registerService.register(postDetailDTO);
	}
}
