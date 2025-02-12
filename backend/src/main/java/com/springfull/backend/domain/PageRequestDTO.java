package com.springfull.backend.domain;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {
		//페이지
		@Builder.Default//빌더 생성시 기본값을 가지도록
		private int page=1;
		
		//한페이지 보여줄 개수
		@Builder.Default
		private int size=10;
		
		//검색조건
		private List<Integer> brand;
		private List<Integer> taste;
		private List<Integer> ingredient;
		
		private Integer min_cost;
		private Integer max_cost;
		
		private String keyword;
		
		private int sort=0;

		
		
		//limit 뒤에 수식처리가 되지 않음으로 미리 값을 만들어두고 게터처럼 사용하도록 만듬
		public int getSkip() {
			return size*(page-1);
		}
		
		public int getBrandsize() {
			return brand.size();
		}
		public int getTastesize() {
			return taste.size();
		}
		public int getIngredientsize() {
			return ingredient.size();
		}
}
