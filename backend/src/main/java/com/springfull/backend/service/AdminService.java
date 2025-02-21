package com.springfull.backend.service;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.ReportDTO;
import com.springfull.backend.domain.UserDTO;

public interface AdminService {
	
	//1.모든 글 보기
	PageResponseDTO<PostDTO> allPost(PageRequestDTO pageRequestDTO);
	
	//2.유저목록보기
	PageResponseDTO<UserDTO> userList(PageRequestDTO pageRequestDTO);
	
	//3.글 읽기
	PostDetailDTO read(int post_no);
	
	//4.유저 상태 변경
	void changeUserState(String member_uuid, int state);
	
	//5.신고글 목록
	PageResponseDTO<ReportDTO> reportList(PageRequestDTO pageRequestDTO);
	
	//6.글 상태 변경
	void changePostState(int post_no, int state);

}
