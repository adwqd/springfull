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
	private int no;
	private String title;
	private String writer_uuid;
	private String writer_name;
	private int like;
	private double star;
	private LocalDateTime regDate;
}
