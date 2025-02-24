package com.springfull.backend.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface RemoveMapper {

	void deleteBrand(@Param("post_no") int post_no);
	
	void deleteTaste(@Param("post_no") int post_no);
	
	void deleteIngredient(@Param("post_no") int post_no);
	
	void deleteImage(@Param("post_no") int post_no);
	
	void deleteLike(@Param("post_no") int post_no);
	
	void deleteStar(@Param("post_no") int post_no);
	
	void deleteBookmark(@Param("post_no") int post_no);
	
	List<Integer> getReply(@Param("post_no") int post_no);
	
	void deleteReplyLike(@Param("reply_no") int reply_no);
	
	void deleteReply(@Param("post_no") int post_no);
	
	void deleteReport(@Param("post_no") int post_no);
	
	void deletePost(@Param("post_no") int post_no);
	
	int getLike(@Param("post_no") int post_no);
}
