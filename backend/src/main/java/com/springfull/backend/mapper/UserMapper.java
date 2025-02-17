package com.springfull.backend.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.springfull.backend.domain.UserDTO;

@Mapper
public interface UserMapper {
	
	//1.기존 회원인지 확인(기존 회원일시 uuid반환)
	String check(@Param("id") String id);
	//2.회원가입
	void signIn(UserDTO userDTO);
}
