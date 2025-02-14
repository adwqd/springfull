package com.springfull.backend.service;

import com.springfull.backend.domain.PostDetailDTO;

public interface PostService {
	PostDetailDTO read(int post_no);
	
	int like(int post_no);
}
