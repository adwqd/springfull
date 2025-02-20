package com.springfull.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.springfull.backend.domain.TagVO;
import com.springfull.backend.domain.ImageDTO;
import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.mapper.RegisterMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class RegisterServiceImpl implements RegisterService {
	
	private final RegisterMapper registerMapper;

	@Override
	public List<TagVO> getCategory() {
		return registerMapper.getCate();
	}

	@Override
	public List<TagVO> getBrandVO(List<Integer> category) {
		if(category != null && category.size()>0) {
			return registerMapper.getBrand(category);
		}else {
			return new ArrayList<>();
		}
		
	}

	@Override
	public List<TagVO> getTasteVO() {
		return registerMapper.getTaste();
	}

	@Override
	public List<TagVO> getIngredientVO(List<Integer> brand) {
		if(brand != null && brand.size()>0) {
			List<Integer> category = registerMapper.getCateByBrand(brand);
			return registerMapper.getIngredient(category);
		}else {
			return new ArrayList<>();
		}		
	}

	@Override
	public int register(PostDetailDTO postDetailDTO) {
		registerMapper.register(postDetailDTO);
		int post_no = postDetailDTO.getPost_no();
		for(int brand:postDetailDTO.getBrand_id()) {
			registerMapper.inputBrand(brand, post_no);
		}
		for(int taste:postDetailDTO.getTaste_id()) {
			registerMapper.inputTaste(taste, post_no);
		}
		for(int ingredient:postDetailDTO.getIngredient_id()) {
			registerMapper.inputIngredient(ingredient, post_no);
		}
		if(postDetailDTO.getImage()!=null && postDetailDTO.getImage().size()>0) {
			int i=0;
			for(ImageDTO temp:postDetailDTO.getImage()) {
				temp.setOrd(i);
				temp.setPost_no(post_no);
				registerMapper.saveImage(temp);
				i++;
			}
		}
		
		return post_no;
	}

}
