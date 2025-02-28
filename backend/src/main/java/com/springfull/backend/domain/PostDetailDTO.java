package com.springfull.backend.domain;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

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
	private String name;
	private String profile_img;
	private int hits;
	private Double star;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd HH:mm", timezone = "Asia/Seoul")
	private LocalDateTime reg_date;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd HH:mm", timezone = "Asia/Seoul")
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
	@Builder.Default
	private List<TagVO> brand = new ArrayList<>();
	@Builder.Default
	private List<TagVO> taste = new ArrayList<>();
	@Builder.Default
	private List<TagVO> ingredient = new ArrayList<>();
	
	public LocalDateTime getMod_Date() {
		if(this.reg_date.equals(this.mod_date)) {
			return null;
		}else {
			return mod_date;
		}
	}
}
