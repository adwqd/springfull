package com.springfull.backend.domain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostDetailDTO {
	
	private int post_no;
	private String title;
	private int cost;
	private String content;
	private int post_like;
	private int hits;
	private Double star;
	private LocalDateTime reg_date;
	private LocalDateTime mod_date;
	private String member_uuid;
	private List<ImageDTO> image;
	@Builder.Default
	private Boolean bookmark =  false;
	@Builder.Default
	private List<Integer> cate_id = new ArrayList<>();
	@Builder.Default
	private List<Integer> brand_id = new ArrayList<>();
	@Builder.Default
	private List<Integer> taste_id = new ArrayList<>();
	@Builder.Default
	private List<Integer> ingredient_id = new ArrayList<>();
	
}
