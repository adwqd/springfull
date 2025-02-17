package com.springfull.backend.domain;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class TagVO {
	private int tag_id;
	private String tag_name;
	private int cate_id;
}
