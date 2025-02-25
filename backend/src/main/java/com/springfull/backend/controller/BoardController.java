package com.springfull.backend.controller;



import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.service.BoardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping
@Log4j2
@RequiredArgsConstructor
public class BoardController {
	
	private final BoardService boardService;
	
	@PostMapping(value = "/list", consumes = MediaType.APPLICATION_JSON_VALUE)
	public PageResponseDTO<PostDTO> list(@RequestBody PageRequestDTO pageRequestDTO) {
		log.info(pageRequestDTO);
		PageResponseDTO<PostDTO> pageResponseDTO = boardService.brandList(pageRequestDTO);
//		List<PostDTO> dtoList = new ArrayList<>();
//		for(int i=0; i<10; i++) {
//			PostDTO postDTO = PostDTO.builder().post_no(i).title(i+"번째 글").reg_Date(LocalDateTime.now())
//										.post_like(i+1).name("김철수"+i).member_uuid("aa"+i*200).build();
//			dtoList.add(postDTO);
//		}
//		PageResponseDTO<PostDTO> pageResponseDTO = PageResponseDTO.<PostDTO>withAll()
//				.pageRequestDTO(pageRequestDTO).dtoList(dtoList).total(20).build();
		return pageResponseDTO;
	}
	
	@GetMapping("/hotranking")
	public List<PostDTO> hotranking(){
		return boardService.hotRanking();
	}
	
	@GetMapping("/cateranking/{cate_id}")
	public List<PostDTO> cateRanking(@PathVariable("cate_id") int cate_id){
		return boardService.cateRanking(cate_id);
	}
	
	@GetMapping("/catebest")
	public List<PostDTO> cateBest(){
		return boardService.cateBest();
	}
	
}
