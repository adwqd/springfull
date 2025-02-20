package com.springfull.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.domain.UploadResultDTO;
import com.springfull.backend.domain.UserDTO;
import com.springfull.backend.mapper.ListMapper;
import com.springfull.backend.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserServiceImpl implements UserService {
	
	private final UserMapper userMapper;
	private final ListMapper listMapper;

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

	@Override
	public String viewProfile(String member_uuid) {
		return userMapper.viewProfile(member_uuid);
	}

	@Override
	public void deleteProfile(String member_uuid) {
		userMapper.deleteProfile(member_uuid);
		
	}

	@Override
	public void insertProfile(String member_uuid, String filename) {
		userMapper.saveProfile(UploadResultDTO.builder().img_uuid(member_uuid).filename(filename).build());
		
	}

	@Override
	public void updateProfile(UserDTO userDTO) {
		userMapper.updateProfile(userDTO);	
	}

	@Override
	public PageResponseDTO<PostDTO> myPost(PageRequestDTO pageRequestDTO) {
		List<PostDTO> dtoList = new ArrayList<>();
		for(PostDTO temp : userMapper.myPost(pageRequestDTO)) {
			temp.setThumbnail(listMapper.getThumbnail(temp.getPost_no()));
			temp.setStar(listMapper.getStar(temp.getPost_no()));
			temp.setProfile_img(userMapper.viewProfile(temp.getMember_uuid()));
			dtoList.add(temp);
		}
		Integer count = userMapper.getMyPostCount(pageRequestDTO);
		if(count==null) {
			count = 0;
		}
		PageResponseDTO<PostDTO> pageResponseDTO = PageResponseDTO.<PostDTO>withAll()
				.pageRequestDTO(pageRequestDTO)
				.dtoList(dtoList)
				.total(count).build();
		System.out.println(pageRequestDTO.getPage()+" "+pageResponseDTO.getPage());
		return pageResponseDTO;
	}

	@Override
	public PageResponseDTO<PostDTO> starPost(PageRequestDTO pageRequestDTO) {
		List<PostDTO> dtoList = new ArrayList<>();
		for(PostDTO temp : userMapper.starPost(pageRequestDTO)) {
			temp.setThumbnail(listMapper.getThumbnail(temp.getPost_no()));
			temp.setProfile_img(userMapper.viewProfile(temp.getMember_uuid()));
			dtoList.add(temp);
		}
		Integer count = userMapper.getStarPostCount(pageRequestDTO);
		if(count==null) {
			count = 0;
		}
		PageResponseDTO<PostDTO> pageResponseDTO = PageResponseDTO.<PostDTO>withAll()
				.pageRequestDTO(pageRequestDTO)
				.dtoList(dtoList)
				.total(count).build();
		System.out.println(pageRequestDTO.getPage()+" "+pageResponseDTO.getPage());
		return pageResponseDTO;
	}
	
	@Override
	public PageResponseDTO<PostDTO> bookMarkedPost(PageRequestDTO pageRequestDTO) {
		List<PostDTO> dtoList = new ArrayList<>();
		for(PostDTO temp : userMapper.bookMarkedPost(pageRequestDTO)) {
			temp.setThumbnail(listMapper.getThumbnail(temp.getPost_no()));
			temp.setStar(listMapper.getStar(temp.getPost_no()));
			temp.setProfile_img(userMapper.viewProfile(temp.getMember_uuid()));
			dtoList.add(temp);
		}
		Integer count = userMapper.getBookMarkedPostCount(pageRequestDTO);
		if(count==null) {
			count = 0;
		}
		PageResponseDTO<PostDTO> pageResponseDTO = PageResponseDTO.<PostDTO>withAll()
				.pageRequestDTO(pageRequestDTO)
				.dtoList(dtoList)
				.total(count).build();
		System.out.println(pageRequestDTO.getPage()+" "+pageResponseDTO.getPage());
		return pageResponseDTO;
	}

}
