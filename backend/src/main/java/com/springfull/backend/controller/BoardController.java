package com.springfull.backend.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;

import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping
@Log4j2
public class BoardController {
	
	@GetMapping("/api/board")
	public PageResponseDTO<PostDTO> board(){
		PageRequestDTO pageRequestDTO = new PageRequestDTO();
		List<PostDTO> dtoList = new ArrayList<>();
		for(int i=0; i<10; i++) {
			PostDTO postDTO = PostDTO.builder().no(i).title(i+"번째 글").regDate(LocalDateTime.now())
										.like(i+1).star(i).writer_name("김철수"+i).writer_uuid("aa"+i*200).build();
			dtoList.add(postDTO);
		}
		PageResponseDTO<PostDTO> pageResponseDTO = PageResponseDTO.<PostDTO>withAll()
				.pageRequestDTO(pageRequestDTO).dtoList(dtoList).total(20).build();
		return pageResponseDTO;
	}
	
}
