package org.phs.test.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class StudentDTO {
	
	String stu_id;
	String stu_name;
}
