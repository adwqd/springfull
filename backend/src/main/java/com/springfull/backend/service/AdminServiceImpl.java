package com.springfull.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.domain.PostDetailDTO;
import com.springfull.backend.domain.ReportDTO;
import com.springfull.backend.domain.UserDTO;
import com.springfull.backend.mapper.AdminMapper;
import com.springfull.backend.mapper.ListMapper;
import com.springfull.backend.mapper.PostMapper;
import com.springfull.backend.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class AdminServiceImpl implements AdminService {
	
	private final AdminMapper adminMapper;
	private final ListMapper listMapper;
	private final UserMapper userMapper;
	private final PostMapper postMapper;

	@Override
	public PageResponseDTO<PostDTO> allPost(PageRequestDTO pageRequestDTO) {
		List<PostDTO> dtoList = new ArrayList<>();
		for(PostDTO temp:adminMapper.allPost(pageRequestDTO)) {
			temp.setThumbnail(listMapper.getThumbnail(temp.getPost_no()));
			temp.setProfile_img(userMapper.viewProfile(temp.getMember_uuid()));
			dtoList.add(temp);
		}
		Integer count = adminMapper.allPostCount(pageRequestDTO);
		PageResponseDTO<PostDTO> pageResponseDTO = PageResponseDTO.<PostDTO>withAll()
				.pageRequestDTO(pageRequestDTO)
				.dtoList(dtoList)
				.total(count).build();
		
		return pageResponseDTO;
	}

	@Override
	public PageResponseDTO<UserDTO> userList(PageRequestDTO pageRequestDTO) {
		List<UserDTO> dtoList = new ArrayList<>();
		for(UserDTO temp:adminMapper.userList(pageRequestDTO)) {
			dtoList.add(temp);
		}
		Integer count = adminMapper.userCount(pageRequestDTO);
		PageResponseDTO<UserDTO> pageResponseDTO = PageResponseDTO.<UserDTO>withAll()
				.pageRequestDTO(pageRequestDTO)
				.dtoList(dtoList)
				.total(count).build();
		
		return pageResponseDTO;
	}

	@Override
	public PostDetailDTO read(int post_no) {
		PostDetailDTO postDetailDTO = adminMapper.read(post_no);
		if(postDetailDTO !=null) {
			postDetailDTO.setBrand_id(postMapper.getBrand(post_no));
			postDetailDTO.setCate_id(postMapper.getCate(post_no));
			postDetailDTO.setTaste_id(postMapper.getTaste(post_no));
			postDetailDTO.setIngredient_id(postMapper.getIngredient(post_no));
			postDetailDTO.setStar(listMapper.getStar(post_no));
			postDetailDTO.setImage(postMapper.getImage(post_no));
		}
		return postDetailDTO;
	}

	@Override
	public void changeUserState(String member_uuid, int state) {
		adminMapper.changeState(member_uuid, state);		
	}

	@Override
	public PageResponseDTO<ReportDTO> reportList(PageRequestDTO pageRequestDTO) {
		List<ReportDTO> dtoList = adminMapper.reportList(pageRequestDTO);
		Integer count = adminMapper.reportCount(pageRequestDTO);
		PageResponseDTO<ReportDTO> pageResponseDTO = PageResponseDTO.<ReportDTO>withAll()
				.pageRequestDTO(pageRequestDTO)
				.dtoList(dtoList)
				.total(count).build();
		return pageResponseDTO;
	}

	@Override
	public void changePostState(int post_no, int state) {
		postMapper.updateState(post_no, state);		
	}

}
