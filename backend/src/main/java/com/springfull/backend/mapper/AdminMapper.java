package com.springfull.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.ReportDTO;
import com.springfull.backend.domain.UserDTO;

@Mapper
public interface AdminMapper {
	
	//모든 글보기
	List<PostDTO> allPost(PageRequestDTO pageRequestDTO);
	//모든 글 카운트
	Integer allPostCount(PageRequestDTO pageRequestDTO);
	//글 읽기
	PostDetailDTO read(@Param("post_no") int post_no);
	//유저 목록보기
	List<UserDTO> userList(PageRequestDTO pageRequestDTO);
	//유저 목록 카운트
	Integer userCount(PageRequestDTO pageRequestDTO);
	//유저 상태변경
	void changeState(@Param("member_uuid")String member_uuid, @Param("state")int state);
	//신고 글 보기
	List<ReportDTO> reportList(PageRequestDTO pageRequestDTO);
	Integer reportCount(PageRequestDTO pageRequestDTO);
	
}
