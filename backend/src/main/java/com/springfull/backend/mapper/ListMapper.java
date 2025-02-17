package com.springfull.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PostDTO;

@Mapper
public interface ListMapper {
	//1.검색해서 목록 뿌려주기
	List<PostDTO> search(PageRequestDTO pageRequestDTO);
	
	Integer getCount(PageRequestDTO pageRequestDTO);
	
	Double getStar(@Param("post_no") int post_no);
				
	String getThumbnail(int post_no);
	
	List<Integer> cateSearch(@Param("category") List<Integer> category);
	
	List<PostDTO> hotRanking();
	
	List<PostDTO> cateRanking(@Param("cate_id") int cate_id);
}
