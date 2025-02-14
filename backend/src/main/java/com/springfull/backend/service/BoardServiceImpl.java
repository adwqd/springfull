package com.springfull.backend.service;

import java.util.ArrayList;
import java.util.List;

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
		if((pageRequestDTO.getCategory().size() >0 && pageRequestDTO.getCategory() !=null) 
				&& (pageRequestDTO.getBrand() ==null || pageRequestDTO.getBrand().size()==0)) {
			pageRequestDTO.setBrand(listMapper.cateSearch(pageRequestDTO.getCategory()));
		}
		List<PostDTO> dtoList = new ArrayList<>();
		for(PostDTO temp : listMapper.search(pageRequestDTO)) {
			temp.setThumbnail(listMapper.getThumbnail(temp.getPost_no()));
			temp.setStar(listMapper.getStar(temp.getPost_no()));
			dtoList.add(temp);
		}
		Integer count = listMapper.getCount(pageRequestDTO);
		if(count==null) {
			count = 0;
		}
		PageResponseDTO<PostDTO> pageResponseDTO = PageResponseDTO.<PostDTO>withAll()
				.pageRequestDTO(pageRequestDTO)
				.dtoList(dtoList)
				.total(count).build();
		System.out.println(pageRequestDTO.getPage()+" "+pageResponseDTO.getPage());
		return pageResponseDTO;
	}

}
