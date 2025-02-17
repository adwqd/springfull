package com.springfull.backend.domain;

import java.util.List;
import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TagDTO {
	
	@Builder.Default
	List<TagVO> category= new ArrayList<>();
	@Builder.Default
	List<TagVO> brand= new ArrayList<>();
	@Builder.Default
	List<TagVO> taste= new ArrayList<>();
	@Builder.Default
	List<TagVO> ingredient= new ArrayList<>();
	

}
