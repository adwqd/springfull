package com.springfull.backend.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springfull.backend.domain.TagVO;
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
	public TagDTO tag(@RequestBody HashMap<String, List<Integer>> tag){
		List<TagVO> brand = registerService.getBrandVO(tag.get("category"));
		TagDTO tagDTO = TagDTO.builder()
				.category(registerService.getCategory())
				.brand(brand)
				.taste(registerService.getTasteVO())
				.ingredient(registerService.getIngredientVO(tag.get("brand")))
				.build();
		return tagDTO;
	}
	
	@PostMapping("/register")
	public int register(@RequestBody PostDetailDTO postDetailDTO) {
		return registerService.register(postDetailDTO);
	}
}
