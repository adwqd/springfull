package com.springfull.backend.service;

import java.util.List;

import com.springfull.backend.domain.BrandVO;
import com.springfull.backend.domain.CategoryVO;
import com.springfull.backend.domain.IngredientVO;
import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.TasteVO;

public interface RegisterService {
	//카테고리
	List<CategoryVO> getCategory();
	
	List<BrandVO> getBrandVO(List<Integer> category);
	List<TasteVO> getTasteVO();
	List<IngredientVO> getIngredientVO(List<Integer> category);
	
	int register(PostDetailDTO postDetailDTO);
	

}
