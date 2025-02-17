package com.springfull.backend.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.springfull.backend.domain.UserDTO;
import com.springfull.backend.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserServiceImpl implements UserService {
	
	private final UserMapper userMapper;

	@Override
	public String login(UserDTO userDTO) {
		String member_uuid = userMapper.check(userDTO.getUser_id());
		if(member_uuid==null) {
			member_uuid = UUID.randomUUID().toString();
			userDTO.setMember_uuid(member_uuid);
			userMapper.signIn(userDTO);
		}
		return member_uuid;
	}

}
