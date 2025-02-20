package com.springfull.backend.service;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.domain.UploadResultDTO;
import com.springfull.backend.domain.UserDTO;

public interface UserService {
	
	String login(UserDTO userDTO);
	
	String viewProfile(String member_uuid);
	void deleteProfile(String member_uuid);
	void insertProfile(String member_uuid, String filename);
	void updateProfile(UserDTO userDTO);
	
	PageResponseDTO<PostDTO> myPost(PageRequestDTO pageRequestDTO);
	PageResponseDTO<PostDTO> starPost(PageRequestDTO pageRequestDTO);
	PageResponseDTO<PostDTO> bookMarkedPost(PageRequestDTO pageRequestDTO);
}
