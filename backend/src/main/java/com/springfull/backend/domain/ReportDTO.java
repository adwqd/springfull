package com.springfull.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportDTO {
	
	private int report_no;
	private int report_type;
	private String content;
	private int post_no;
	private String member_uuid;
}
