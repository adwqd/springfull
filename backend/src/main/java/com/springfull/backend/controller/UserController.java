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
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.domain.UploadFileDTO;
import com.springfull.backend.domain.UploadResultDTO;
import com.springfull.backend.domain.UserDTO;
import com.springfull.backend.kakao.KakaoApi;
import com.springfull.backend.service.UserService;
import com.springfull.backend.util.FileStorageUtil;
import com.springfull.backend.util.JWTUtil;
import com.springfull.backend.util.MultipartFileUtils;

import jakarta.servlet.http.HttpServletRequest;
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
		log.info("이거시코드"+code);
        // 2. 토큰 받기
        String accessToken = kakaoApi.getAccessToken(code);

        // 3. 사용자 정보 받기
        Map<String, Object> userInfo = kakaoApi.getUserInfo(accessToken);
        String nickname = (String) userInfo.get("nickname");
        String profileImageUrl = (String) userInfo.get("profile");
        UserDTO userDTO = userService.login(UserDTO.builder().user_id((String)userInfo.get("id")).name(nickname).build());
        String member_uuid = userDTO.getMember_uuid();
        String profile = userService.viewProfile(member_uuid);
        if(profile == null && profileImageUrl != null && !profileImageUrl.isEmpty()) {
        	MultipartFile multipartFile = MultipartFileUtils.urlToMultipartFile(profileImageUrl);
        	String originalName =  multipartFile.getOriginalFilename();
			log.info(originalName);
			Path savePath = Paths.get(uploadPath, member_uuid+"_"+originalName);
			try {
				if(Files.probeContentType(savePath).startsWith("image")) {					
					boolean img = true;			
					multipartFile.transferTo(savePath);
					//썸네일 저장
					File thumbFile = new File(uploadPath, "s_" + member_uuid+"_"+originalName);
					Thumbnailator.createThumbnail(savePath.toFile(), thumbFile, 100, 100);						
					UploadResultDTO uploadResultDTO = UploadResultDTO.builder().img_uuid(member_uuid).filename(originalName).img(img).build();
					userService.insertProfile(member_uuid, originalName);
				}else{
				}
			} catch (IllegalStateException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
        }       
        String state = Integer.toString(userDTO.getState());
        if(member_uuid==null) {
        	return null;
        }
        System.out.println("nickname = " + nickname);
        System.out.println("accessToken = " + accessToken);
        System.out.println(member_uuid+"이거다");
        HashMap<String, String> map = new HashMap<>();
        map.put("member_uuid", member_uuid);
        map.put("accessToken", jwtUtil.generateToken(member_uuid, nickname, state));
        String refreshToken = jwtUtil.generateRefreshToken(member_uuid);
        map.put("refreshToken", refreshToken);
        map.put("name", nickname);
        map.put("state", Integer.toString(userDTO.getState()));
        userService.saveToken(member_uuid, refreshToken);
        
		return map;
	}
	
	@PostMapping(value = "/member/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public List<UploadResultDTO> profile(UploadFileDTO uploadFileDTO, HttpServletRequest httpServletRequest) {
		String accessToken = jwtUtil.getAccessToken(httpServletRequest);
		String uuid = jwtUtil.getUUID(accessToken);
		log.info(uploadFileDTO);
		if(uploadFileDTO.getFiles() != null) {
			List<UploadResultDTO> list = new ArrayList<>();
			uploadFileDTO.getFiles().forEach(multipartFile -> {
				String originalName =  multipartFile.getOriginalFilename();
				log.info(originalName);
				Path savePath = Paths.get(uploadPath, uuid+"_"+originalName);
				try {
					if(Files.probeContentType(savePath).startsWith("image")) {					
						String past = userService.viewProfile(uuid);
						boolean img = true;
						if(past != null) {
							Resource resource = new FileSystemResource(uploadPath+File.separator+past);
							try {resource.getFile().delete();} catch (IOException e) {e.printStackTrace();}
							resource = new FileSystemResource(uploadPath+File.separator+"s_"+past);
							try {resource.getFile().delete();} catch (IOException e) {e.printStackTrace();}
							userService.deleteProfile(uuid);
						}				
						multipartFile.transferTo(savePath);
						//썸네일 저장
						File thumbFile = new File(uploadPath, "s_" + uuid+"_"+originalName);
						Thumbnailator.createThumbnail(savePath.toFile(), thumbFile, 100, 100);						
						UploadResultDTO uploadResultDTO = UploadResultDTO.builder().img_uuid(uuid).filename(originalName).img(img).build();
						userService.insertProfile(uuid, originalName);
						list.add(uploadResultDTO);
					}else{
						list.add(null);
					}
				} catch (IllegalStateException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}});
			return list;
		}
		
		return null;
	}
	
	@PutMapping("/member/modprofile")
	public void updateProfile(@RequestBody UserDTO userDTO, HttpServletRequest httpServletRequest) {
		String accessToken = jwtUtil.getAccessToken(httpServletRequest);
		String uuid = jwtUtil.getUUID(accessToken);
		if(uuid.equals(userDTO.getMember_uuid())) {
			userService.updateProfile(userDTO);
		}
		
	}
	
	@PostMapping(value = "/member/mypost", consumes = MediaType.APPLICATION_JSON_VALUE)
	public PageResponseDTO<PostDTO> myPost(@RequestBody PageRequestDTO pageRequestDTO, HttpServletRequest httpServletRequest) {
		log.info(pageRequestDTO);
		String accessToken = jwtUtil.getAccessToken(httpServletRequest);
		String uuid = jwtUtil.getUUID(accessToken);
		pageRequestDTO.setMember_uuid(uuid);
		PageResponseDTO<PostDTO> pageResponseDTO = userService.myPost(pageRequestDTO);
		return pageResponseDTO;
	}
	
	@PostMapping(value = "/member/starpost", consumes = MediaType.APPLICATION_JSON_VALUE)
	public PageResponseDTO<PostDTO> starPost(@RequestBody PageRequestDTO pageRequestDTO, HttpServletRequest httpServletRequest) {
		log.info(pageRequestDTO);
		String accessToken = jwtUtil.getAccessToken(httpServletRequest);
		String uuid = jwtUtil.getUUID(accessToken);
		pageRequestDTO.setMember_uuid(uuid);
		PageResponseDTO<PostDTO> pageResponseDTO = userService.starPost(pageRequestDTO);
		return pageResponseDTO;
	}
	
	@PostMapping(value = "/member/mybookmark", consumes = MediaType.APPLICATION_JSON_VALUE)
	public PageResponseDTO<PostDTO> bookMarkedPost(@RequestBody PageRequestDTO pageRequestDTO, HttpServletRequest httpServletRequest) {
		log.info(pageRequestDTO);
		String accessToken = jwtUtil.getAccessToken(httpServletRequest);
		String uuid = jwtUtil.getUUID(accessToken);
		pageRequestDTO.setMember_uuid(uuid);
		PageResponseDTO<PostDTO> pageResponseDTO = userService.bookMarkedPost(pageRequestDTO);
		return pageResponseDTO;
	}
	
	@GetMapping("/token")
	public HashMap<String, String> tokenCheck(HttpServletRequest httpServletRequest){
		String refreshToken = jwtUtil.getRefreshToken(httpServletRequest);
		String uuid = jwtUtil.getRefreshUUID(refreshToken);
		if(userService.tokenCheck(uuid, refreshToken)) {
			UserDTO userDTO = userService.getUser(uuid);
			HashMap<String, String> map = new HashMap<>();
	        map.put("member_uuid", uuid);
	        map.put("accessToken", jwtUtil.generateToken(uuid, userDTO.getName(), Integer.toString(userDTO.getState())));
	        map.put("refreshToken", jwtUtil.generateRefreshToken(uuid));
	        userService.saveToken(uuid, refreshToken);
	        return map;
		}
		return null;
	}
	
	@GetMapping("/profile/{member_uuid}")
	public ResponseEntity<Resource> viewFileGet(@PathVariable("member_uuid") String member_uuid){
		log.info("프로필 호출"+member_uuid);
		String fileName = userService.viewProfile(member_uuid);
		log.info("파일이름"+fileName);
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
	
}
