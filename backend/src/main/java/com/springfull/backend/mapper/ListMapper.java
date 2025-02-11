package com.springfull.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PostDTO;

@Mapper
public interface ListMapper {
	//1.브랜드 게시판목록보기
	List<PostDTO> brandList(PageRequestDTO pageRequestDTO);
	
	int getCount(PageRequestDTO pageRequestDTO);
	
	double getStar(int post_no);
}
