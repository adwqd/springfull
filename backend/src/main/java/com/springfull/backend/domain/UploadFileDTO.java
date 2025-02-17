package com.springfull.backend.domain;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class UploadFileDTO {
	
	private List<MultipartFile> files;
}
