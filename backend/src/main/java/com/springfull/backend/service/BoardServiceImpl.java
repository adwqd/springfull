package com.springfull.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import com.springfull.backend.domain.PageRequestDTO;
import com.springfull.backend.domain.PageResponseDTO;
import com.springfull.backend.domain.PostDTO;
import com.springfull.backend.domain.TagVO;
import com.springfull.backend.mapper.ListMapper;
import com.springfull.backend.mapper.RegisterMapper;
import com.springfull.backend.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class BoardServiceImpl implements BoardService {
	
	private final ListMapper listMapper;
	private final UserMapper userMapper;
	private final RegisterMapper registerMapper;
	
	@Override
	public PageResponseDTO<PostDTO> brandList(PageRequestDTO pageRequestDTO) {
		if((pageRequestDTO.getCategory().size() >0 && pageRequestDTO.getCategory() !=null) 
				&& (pageRequestDTO.getBrand() ==null || pageRequestDTO.getBrand().size()==0)) {
			pageRequestDTO.setBrand(listMapper.cateSearch(pageRequestDTO.getCategory()));
		}
		List<PostDTO> dtoList = new ArrayList<>();
		for(PostDTO temp : listMapper.search(pageRequestDTO)) {
			temp.setThumbnail(listMapper.getThumbnail(temp.getPost_no()));
			temp.setStar(listMapper.getStar(temp.getPost_no()));
			temp.setProfile_img(userMapper.viewProfile(temp.getMember_uuid()));
			dtoList.add(temp);
		}
		Integer count = listMapper.getCount(pageRequestDTO);
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
	public List<PostDTO> hotRanking() {
		List<PostDTO> list = new ArrayList<>();
		for(PostDTO temp:listMapper.hotRanking()) {
			temp.setStar(listMapper.getStar(temp.getPost_no()));
			temp.setThumbnail(listMapper.getThumbnail(temp.getPost_no()));
			temp.setProfile_img("s_"+userMapper.viewProfile(temp.getMember_uuid()));
			list.add(temp);
		}
		return list;
	}

	@Override
	public List<PostDTO> cateRanking(int cate_id) {
		List<PostDTO> list = new ArrayList<>();
		for(PostDTO temp:listMapper.cateRanking(cate_id, 10)) {
			temp.setThumbnail(listMapper.getThumbnail(temp.getPost_no()));
			temp.setProfile_img("s_"+userMapper.viewProfile(temp.getMember_uuid()));
			list.add(temp);
		}
		return list;
	}

	@Override
	public HashMap<String, PostDTO> cateBest() {
		HashMap<String, PostDTO> map = new HashMap<>();
		List<TagVO> cate = registerMapper.getCate();
		for(TagVO temp:cate) {
			List<PostDTO> tempList = listMapper.cateRanking(temp.getTag_id(), 1);
			PostDTO post = new PostDTO();
			if(tempList!=null && tempList.size()>0) {
				post = tempList.get(0);
				post.setMember_uuid(String.valueOf(temp.getTag_id()));
				post.setName(temp.getTag_name());
				map.put(temp.getTag_name(), post);
			}
		}
		return map;
	}

	@Override
	public List<PostDTO> recent() {
		List<PostDTO> list = new ArrayList<>();
		for(PostDTO temp:listMapper.recent()) {
			temp.setThumbnail(listMapper.getThumbnail(temp.getPost_no()));
			list.add(temp);
		}
		return list;
	}

}
