package com.springfull.backend.controller;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springfull.backend.domain.UploadFileDTO;
import com.springfull.backend.domain.UploadResultDTO;

import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;

@RestController
@Log4j2
public class UpDownController {
	
	@Value("${com.springfull.upload.path}")
	private String uploadPath;
	
	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public List<UploadResultDTO> upload(UploadFileDTO uploadFileDTO) {
		
		log.info(uploadFileDTO);
		if(uploadFileDTO.getFiles() != null) {
			List<UploadResultDTO> list = new ArrayList<>();
			uploadFileDTO.getFiles().forEach(multipartFile -> {
				String originalName =  multipartFile.getOriginalFilename();
				
				log.info(originalName);
				String uuid = UUID.randomUUID().toString();
				Path savePath = Paths.get(uploadPath, uuid+"_"+originalName);
				boolean img = false;
				try {
					multipartFile.transferTo(savePath);
					
					//썸네일 저장
					if(Files.probeContentType(savePath).startsWith("image")) {
						img = true;
						File thumbFile = new File(uploadPath, "s_" + uuid+"_"+originalName);
						Thumbnailator.createThumbnail(savePath.toFile(), thumbFile, 200, 200);
					}
				} catch(IOException e) {
					e.printStackTrace();
				}
				list.add(UploadResultDTO.builder().img_uuid(uuid).filename(originalName).img(img).build());
			});
			return list;
		}
		
		return null;
	}
	
	@GetMapping("/view/{fileName}")
	public ResponseEntity<Resource> viewFileGet(@PathVariable("fileName") String fileName){
		Resource resource = new FileSystemResource(uploadPath+File.separator+fileName);
		//String resourceName = resource.getFilename();
		HttpHeaders headers = new HttpHeaders();
		try {
			headers.add("Content-Type", Files.probeContentType(resource.getFile().toPath()));
		} catch(Exception e) {
			return ResponseEntity.internalServerError().build();
		}
		return ResponseEntity.ok().headers(headers).body(resource);
	}
	
//	@PostMapping("/imagelist")
//	public List<ResponseEntity<Resource>> imageList(@RequestBody List<ImageDTO> fileList){
//		List<ResponseEntity<Resource>> list = new ArrayList<>();
//		for(ImageDTO file:fileList) {
//			String fileName = file.getLink();
//			Resource resource = new FileSystemResource(uploadPath+File.separator+fileName);
//			//String resourceName = resource.getFilename();
//			HttpHeaders headers = new HttpHeaders();
//			try {
//				headers.add("Content-Type", Files.probeContentType(resource.getFile().toPath()));
//			} catch(Exception e) {
//				list.add(ResponseEntity.internalServerError().build());
//			}
//			list.add(ResponseEntity.ok().headers(headers).body(resource));
//		}
//		return list;
//	}
	
	@DeleteMapping("/remove/{fileName}")
	public Map<String, Boolean> removeFile(@PathVariable("fileName") String fileName){
		Resource resource = new FileSystemResource(uploadPath+File.separator+fileName);
		//String resourceName = resource.getFilename();
		Map<String, Boolean> resultMap = new HashMap<>();
		boolean removed = false;
		try {
			String contentType = Files.probeContentType(resource.getFile().toPath());
			removed = resource.getFile().delete();
			
			if(contentType.startsWith("image")) {
				File thumbnailFile = new File(uploadPath + File.separator+"s_"+fileName);
				thumbnailFile.delete();
			} 
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		resultMap.put("result", removed);
		return resultMap;
	}
	
	
}
