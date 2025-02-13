package com.springfull.backend.domain;

import java.util.List;
import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TagDTO {
	
	@Builder.Default
	List<CategoryVO> category= new ArrayList<>();
	@Builder.Default
	List<BrandVO> brand= new ArrayList<>();
	@Builder.Default
	List<TasteVO> taste= new ArrayList<>();
	@Builder.Default
	List<IngredientVO> ingredient= new ArrayList<>();
	

}
