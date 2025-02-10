package org.phs.test.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface TestMapper {
	
	@Select("select stu_name from student where stu_id=1")
	String getStudent1();

}
