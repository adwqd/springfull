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
	//2.갯수
	Integer getCount(PageRequestDTO pageRequestDTO);
	//3.별점
	Double getStar(@Param("post_no") int post_no);
	//4.썸네일 가져오기			
	String getThumbnail(int post_no);
	//5.카테고리로 브랜드 가져오기
	List<Integer> cateSearch(@Param("category") List<Integer> category);
	//6.급상승 랭킹
	List<PostDTO> hotRanking();
	//7.카테고리 랭킹
	List<PostDTO> cateRanking(@Param("cate_id") int cate_id, @Param("size") int size);
	//8.최신 글
	List<PostDTO> recent();
	
}
