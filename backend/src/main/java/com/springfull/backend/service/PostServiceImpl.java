package com.springfull.backend.service;

import org.springframework.stereotype.Service;

import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.mapper.PostMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;


@Service
@RequiredArgsConstructor
@Log4j2
public class PostServiceImpl implements PostService {
	
	private final PostMapper postMapper;

	@Override
	public PostDetailDTO read(int post_no) {
		PostDetailDTO postDetailDTO = postMapper.read(post_no);
		postDetailDTO.setBrand_id(postMapper.getBrand(post_no));
		postDetailDTO.setCate_id(postMapper.getCate(post_no));
		postDetailDTO.setTaste_id(postMapper.getTaste(post_no));
		postDetailDTO.setIngredient_id(postMapper.getIngredient(post_no));
		return postDetailDTO;
	}

	@Override
	public int like(int post_no) {
		Integer record_no = postMapper.like_check(post_no);
		if(record_no!=null) {
			postMapper.like_plus(record_no);
		}else {
			postMapper.new_like(post_no);
		}
		int like = postMapper.getLike(post_no);
		postMapper.like_update(post_no, like);
		return like;
	}

}
