package com.springfull.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ImageDTO {
	private String img_uuid;
	private String filename;
	private Integer ord;
	private int post_no;
	public String getLink() {
		return img_uuid+"_"+filename;
}
}
