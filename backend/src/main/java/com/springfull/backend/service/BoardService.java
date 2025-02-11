package com.springfull.backend.service;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;

public interface BoardService {
	PageResponseDTO<PostDTO> brandList(PageRequestDTO pageRequestDTO);
}
