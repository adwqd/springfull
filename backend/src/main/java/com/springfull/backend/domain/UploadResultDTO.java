package com.springfull.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UploadResultDTO {
	
	private String img_uuid;
	private String filename;
	private boolean img;
	public String getLink() {
			return img_uuid+"_"+filename;
	}
}
