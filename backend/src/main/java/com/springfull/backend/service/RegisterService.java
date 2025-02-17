package com.springfull.backend.service;

import java.util.List;

import com.springfull.backend.domain.TagVO;
import com.springfull.backend.domain.PostDetailDTO;

public interface RegisterService {
	//카테고리
	List<TagVO> getCategory();
	
	List<TagVO> getBrandVO(List<Integer> category);
	List<TagVO> getTasteVO();
	List<TagVO> getIngredientVO(List<Integer> brand);
	
	int register(PostDetailDTO postDetailDTO);
	

}
