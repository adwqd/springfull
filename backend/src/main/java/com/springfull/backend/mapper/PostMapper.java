package com.springfull.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.springfull.backend.domain.PostDetailDTO;

@Mapper
public interface PostMapper {
	
	//글 상세보기
	PostDetailDTO read(@Param("post_no") int post_no);
	
	//브랜드
	List<Integer> getBrand(@Param("post_no") int post_no);
	//맛
	List<Integer> getTaste(@Param("post_no") int post_no);
	//재료
	List<Integer> getIngredient(@Param("post_no") int post_no);
	//카테고리
	List<Integer> getCate(@Param("post_no") int post_no);
	
	//좋아요 체크
	Integer like_check(@Param("post_no") int post_no);
	//새로운 좋아요
	void new_like(@Param("post_no") int post_no);
	//기존 좋아요
	void like_plus(@Param("record_no") int record_no);
	//좋아요 갯수 총합 얻기
	Integer getLike(@Param("post_no") int post_no);
	//좋아요 갯수 반영하기
	void like_update(@Param("post_no") int post_no, @Param("like") int like);
}
