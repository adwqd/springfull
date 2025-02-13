package com.springfull.backend.domain;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class IngredientVO {
	
	private int ingredient_id;
	private String ingredient_name;
	private int cate_id;
}
