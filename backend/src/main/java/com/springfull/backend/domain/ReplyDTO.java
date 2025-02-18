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
public class ReplyDTO {
	private Integer reply_no;
	private String reply_content;
	private LocalDateTime reply_reg_date;
	private LocalDateTime reply_mod_date;
	private Integer reply_like;
	private Integer post_no;
	private String member_uuid;
	
}
