package com.springfull.backend.domain;


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
		private int[] brand;
		private int[] taste;
		private int[] option;
		
		private int min_cost;
		private int max_cost;
		
		private String keyword;
		
		private int sort;

		
		
		//limit 뒤에 수식처리가 되지 않음으로 미리 값을 만들어두고 게터처럼 사용하도록 만듬
		public int getSkip() {
			return size*(page-1);
		}
}
