package com.springfull.backend.domain;

import java.time.LocalDateTime;

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
	private Double star;
	private String thumbnail;
	private LocalDateTime reg_Date;
}
