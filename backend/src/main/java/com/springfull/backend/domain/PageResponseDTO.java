package com.springfull.backend.domain;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PageResponseDTO<E> {
	//페이지정보
		//1.페이지 번호
		private int page;
		//2.한페이지 보여줄 개수
		private int size;
		//3.전체 글 개수(마지막 페이지 계산을 위한)
		private int total;
		
		
		//페이지바를 만들기위한 정보 4개
		//시작 페이지 번호
		private int start;
		//끝 페이지 번호
		private int end;	
		//이전페이지의 존재여부
		private boolean prev;
		//다음 페이지의 존재여부
		private boolean next;
		
		//페이지 내용
		private List<E> dtoList; 
		
		//pageRequestDTO로 수집된 페이지 정보를 이 클래스에 매핑 - 생성자 매핑
		@Builder(builderMethodName = "withAll")
		public PageResponseDTO(PageRequestDTO pageRequestDTO, List<E> dtoList, int total) {
			this.page = pageRequestDTO.getPage();
			this.size = pageRequestDTO.getSize();
			
			this.total = total;
			this.dtoList = dtoList;
			
			//페이지 바 만들기
			this.end = (int) (Math.ceil(this.page/10.0)*10);
			this.start = this.end-9;
			
			//실제 마지막 페이지
			int last = (int) Math.ceil(this.total/(double)size);
			
			end = end>last ? last : end;
			
			prev = start>1;
			next = end<last;
		}
}
