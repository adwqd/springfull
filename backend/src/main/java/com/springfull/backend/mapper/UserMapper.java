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
	UserDTO check(@Param("id") String id);
	//2.회원가입
	void signIn(UserDTO userDTO);
	//프로필 주소 가져오기
	String viewProfile(@Param("img_uuid") String img_uuid);
	//프로필 저장하기
	void saveProfile(UploadResultDTO uploadResultDTO);
	//프로필 지우기
	void deleteProfile(@Param("img_uuid") String img_uuid);
	//프로필 바꾸기
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
	
	void saveToken(@Param("member_uuid") String member_uuid, @Param("token") String token);
	String getToken(@Param("member_uuid") String member_uuid);
	
	UserDTO getUser(@Param("member_uuid") String member_uuid);
}
