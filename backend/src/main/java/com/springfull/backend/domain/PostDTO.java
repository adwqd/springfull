package com.springfull.backend.domain;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDTO {
	private int post_no;
	private String title;
	private String member_uuid;
	private String name;
	private int post_like;
	private Integer cost;
	private Double star;
	private String thumbnail;
	private String profile_img;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd", timezone = "Asia/Seoul")
	private LocalDateTime reg_date;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd", timezone = "Asia/Seoul")
	private LocalDateTime mod_date;
	private Integer state;
	private Double myStar;
	
	public LocalDateTime getMod_date() {
		if(this.reg_date.equals(this.mod_date)) {
			return null;
		}else {
			return mod_date;
		}
	}
}
