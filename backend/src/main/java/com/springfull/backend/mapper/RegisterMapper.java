package com.springfull.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.springfull.backend.domain.BrandVO;
import com.springfull.backend.domain.CategoryVO;
import com.springfull.backend.domain.IngredientVO;
import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.TasteVO;

@Mapper
public interface RegisterMapper {
	
	List<CategoryVO> getCate();
	
	List<BrandVO> getBrand(@Param("category") List<Integer> category);
	
	List<TasteVO> getTaste();
	
	List<IngredientVO> getIngredient(@Param("category") List<Integer> category);
	
	int register(PostDetailDTO postDetailDTO);
	
	int inputBrand(@Param("brand_id") int brand_id, @Param("post_no") int post_no);
	int inputTaste(@Param("taste_id") int taste_id, @Param("post_no") int post_no);
	int inputIngredient(@Param("ingredient_id") int ingredient_id, @Param("post_no") int post_no);
}
