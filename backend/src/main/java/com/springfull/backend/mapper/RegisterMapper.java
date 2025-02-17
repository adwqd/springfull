package com.springfull.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.springfull.backend.domain.TagVO;
import com.springfull.backend.domain.PostDetailDTO;

@Mapper
public interface RegisterMapper {
	
	List<TagVO> getCate();
	List<Integer> getCateByBrand(@Param("brand") List<Integer> brand);
	
	List<TagVO> getBrand(@Param("category") List<Integer> category);
	
	List<TagVO> getTaste();
	
	List<TagVO> getIngredient(@Param("category") List<Integer> category);
	
	int register(PostDetailDTO postDetailDTO);
	
	int inputBrand(@Param("brand_id") int brand_id, @Param("post_no") int post_no);
	int inputTaste(@Param("taste_id") int taste_id, @Param("post_no") int post_no);
	int inputIngredient(@Param("ingredient_id") int ingredient_id, @Param("post_no") int post_no);
}
