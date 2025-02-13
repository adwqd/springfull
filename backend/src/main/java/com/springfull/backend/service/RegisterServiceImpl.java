package com.springfull.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.springfull.backend.domain.BrandVO;
import com.springfull.backend.domain.CategoryVO;
import com.springfull.backend.domain.IngredientVO;
import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.TasteVO;
import com.springfull.backend.mapper.RegisterMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class RegisterServiceImpl implements RegisterService {
	
	private final RegisterMapper registerMapper;

	@Override
	public List<CategoryVO> getCategory() {
		return registerMapper.getCate();
	}

	@Override
	public List<BrandVO> getBrandVO(List<Integer> category) {
		if(category != null && category.size()>0) {
			return registerMapper.getBrand(category);
		}else {
			return new ArrayList<>();
		}
		
	}

	@Override
	public List<TasteVO> getTasteVO() {
		return registerMapper.getTaste();
	}

	@Override
	public List<IngredientVO> getIngredientVO(List<Integer> category) {
		if(category != null && category.size()>0) {
			return registerMapper.getIngredient(category);
		}else {
			return new ArrayList<>();
		}		
	}

	@Override
	public int register(PostDetailDTO postDetailDTO) {
		registerMapper.register(postDetailDTO);
		int post_no = postDetailDTO.getPost_no();
		for(int brand:postDetailDTO.getBrand()) {
			registerMapper.inputBrand(brand, post_no);
		}
		for(int taste:postDetailDTO.getTaste()) {
			registerMapper.inputTaste(taste, post_no);
		}
		for(int ingredient:postDetailDTO.getIngredient()) {
			registerMapper.inputIngredient(ingredient, post_no);
		}
		
		return post_no;
	}

}
