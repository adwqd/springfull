package com.springfull.backend.service;

import java.util.List;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;

public interface BoardService {
	PageResponseDTO<PostDTO> brandList(PageRequestDTO pageRequestDTO);
	
	List<PostDTO> hotRanking();
	List<PostDTO> cateRanking(int cate_id);
}
