package com.springfull.backend.service;

import org.springframework.stereotype.Service;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.mapper.ListMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {
	
	private final ListMapper listMapper;
	
	@Override
	public PageResponseDTO<PostDTO> brandList(PageRequestDTO pageRequestDTO) {
		PageResponseDTO<PostDTO> pageResponseDTO = PageResponseDTO.<PostDTO>withAll()
				.pageRequestDTO(pageRequestDTO)
				.dtoList(listMapper.brandList(pageRequestDTO))
				.total(listMapper.getCount(pageRequestDTO)).build();
		return pageResponseDTO;
	}

}
