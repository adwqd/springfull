package com.springfull.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.springfull.backend.domain.TagVO;
import com.springfull.backend.domain.ImageDTO;
import com.springfull.backend.domain.PostDetailDTO;

@Mapper
public interface RegisterMapper {
	//카테고리 가져오기
	List<TagVO> getCate();
	//브랜드로 카테고리 가져오기
	List<Integer> getCateByBrand(@Param("brand") List<Integer> brand);
	//브랜드태그 가져오기
	List<TagVO> getBrand(@Param("category") List<Integer> category);
	//맛태그 가져오기
	List<TagVO> getTaste();
	//재료태그 가져오기
	List<TagVO> getIngredient(@Param("category") List<Integer> category);
	//글쓰기
	int register(PostDetailDTO postDetailDTO);
	//브랜드 입력
	int inputBrand(@Param("brand_id") int brand_id, @Param("post_no") int post_no);
	//맛 입력
	int inputTaste(@Param("taste_id") int taste_id, @Param("post_no") int post_no);
	//재료 입력
	int inputIngredient(@Param("ingredient_id") int ingredient_id, @Param("post_no") int post_no);
	//이미지 저장
	void saveImage(ImageDTO imageDTO);
	
	
}
