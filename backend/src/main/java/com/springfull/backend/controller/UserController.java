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

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.domain.UploadFileDTO;
import com.springfull.backend.domain.UploadResultDTO;
import com.springfull.backend.domain.UserDTO;
import com.springfull.backend.kakao.KakaoApi;
import com.springfull.backend.service.UserService;
import com.springfull.backend.util.JWTUtil;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;

@RestController
@RequiredArgsConstructor
@Log4j2
public class UserController {
	
	private final KakaoApi kakaoApi;
	private final UserService userService;
	private final JWTUtil jwtUtil;
	@Value("${com.springfull.upload.path}")
	private String uploadPath;
	
	@GetMapping("/kakao/callback")
	public HashMap<String, String> login(@RequestParam("code") String code) {
		// 1. 인가 코드 받기 (@RequestParam String code)

        // 2. 토큰 받기
        String accessToken = kakaoApi.getAccessToken(code);

        // 3. 사용자 정보 받기
        Map<String, Object> userInfo = kakaoApi.getUserInfo(accessToken);
        String nickname = (String) userInfo.get("nickname");
        UserDTO userDTO = UserDTO.builder().user_id((String)userInfo.get("id")).name(nickname).build();
        String member_uuid =userService.login(userDTO);
        if(member_uuid==null) {
        	return null;
        }
        System.out.println("nickname = " + nickname);
        System.out.println("accessToken = " + accessToken);
        System.out.println(member_uuid+"이거다");
        HashMap<String, String> map = new HashMap<>();
        HashMap<String, Object> claim = new HashMap<>();
        claim.put("member_uuid", member_uuid);
        map.put("member_uuid", member_uuid);
        map.put("accessToken", jwtUtil.generateToken(claim, 1));
        map.put("refreshToken", jwtUtil.generateToken(claim, 30));
        
		return map;
	}
	
	@PostMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public List<UploadResultDTO> profile(UploadFileDTO uploadFileDTO, @RequestParam("uuid") String uuid) {
		
		log.info(uploadFileDTO);
		if(uploadFileDTO.getFiles() != null) {
			List<UploadResultDTO> list = new ArrayList<>();
			uploadFileDTO.getFiles().forEach(multipartFile -> {
				String originalName =  multipartFile.getOriginalFilename();
				log.info(originalName);
				Path savePath = Paths.get(uploadPath, uuid+"_"+originalName);
				String past = userService.viewProfile(uuid);
				boolean img = false;
				if(past != null) {
					Resource resource = new FileSystemResource(uploadPath+File.separator+past);
					try {resource.getFile().delete();} catch (IOException e) {e.printStackTrace();}
					resource = new FileSystemResource(uploadPath+File.separator+"s_"+past);
					try {resource.getFile().delete();} catch (IOException e) {e.printStackTrace();}
					userService.deleteProfile(uuid);
				}				
				try {
					multipartFile.transferTo(savePath);
					//썸네일 저장
					if(Files.probeContentType(savePath).startsWith("image")) {
						img = true;
						File thumbFile = new File(uploadPath, "s_" + uuid+"_"+originalName);
						Thumbnailator.createThumbnail(savePath.toFile(), thumbFile, 100, 100);
					}
				} catch(IOException e) {
					e.printStackTrace();
				}
				UploadResultDTO uploadResultDTO = UploadResultDTO.builder().img_uuid(uuid).filename(originalName).img(img).build();
				userService.insertProfile(uuid, originalName);
				list.add(uploadResultDTO);
			});
			return list;
		}
		
		return null;
	}
	
	@PutMapping("/modprofile")
	public void updateProfile(@RequestBody UserDTO userDTO) {
		userService.updateProfile(userDTO);
	}
	
	@PostMapping(value = "/mypost", consumes = MediaType.APPLICATION_JSON_VALUE)
	public PageResponseDTO<PostDTO> myPost(@RequestBody PageRequestDTO pageRequestDTO) {
		log.info(pageRequestDTO);
		PageResponseDTO<PostDTO> pageResponseDTO = userService.myPost(pageRequestDTO);
		return pageResponseDTO;
	}
	
	@PostMapping(value = "/starpost", consumes = MediaType.APPLICATION_JSON_VALUE)
	public PageResponseDTO<PostDTO> starPost(@RequestBody PageRequestDTO pageRequestDTO) {
		log.info(pageRequestDTO);
		PageResponseDTO<PostDTO> pageResponseDTO = userService.starPost(pageRequestDTO);
		return pageResponseDTO;
	}
	
	@PostMapping(value = "/mybookmark", consumes = MediaType.APPLICATION_JSON_VALUE)
	public PageResponseDTO<PostDTO> bookMarkedPost(@RequestBody PageRequestDTO pageRequestDTO) {
		log.info(pageRequestDTO);
		PageResponseDTO<PostDTO> pageResponseDTO = userService.bookMarkedPost(pageRequestDTO);
		return pageResponseDTO;
	}
	
}
