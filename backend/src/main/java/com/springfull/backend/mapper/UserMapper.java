package com.springfull.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.domain.UploadResultDTO;
import com.springfull.backend.domain.UserDTO;

@Mapper
public interface UserMapper {
	
	//1.기존 회원인지 확인(기존 회원일시 uuid반환)
	String check(@Param("id") String id);
	//2.회원가입
	void signIn(UserDTO userDTO);
	
	String viewProfile(@Param("img_uuid") String img_uuid);
	void saveProfile(UploadResultDTO uploadResultDTO);
	void deleteProfile(@Param("img_uuid") String img_uuid);
	
	void updateProfile(UserDTO userdto);
	
	//내가 쓴 글
	List<PostDTO> myPost(PageRequestDTO pageRequestDTO);
	Integer getMyPostCount(PageRequestDTO pageRequestDTO);
	//별점 준 글
	List<PostDTO> starPost(PageRequestDTO pageRequestDTO);
	Integer getStarPostCount(PageRequestDTO pageRequestDTO);
	//북마크 한 글
	List<PostDTO> bookMarkedPost(PageRequestDTO pageRequestDTO);
	Integer getBookMarkedPostCount(PageRequestDTO pageRequestDTO);
}
