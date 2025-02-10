package org.phs.test.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class StudentVO {
	String stu_id;
	String stu_name;
}
