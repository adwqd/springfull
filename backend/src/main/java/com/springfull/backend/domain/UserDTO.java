package com.springfull.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
	private String member_uuid;
	private Integer logintype;
	private String user_id;
	private String name;
	private String description;
	private String email;
	private Integer state;
	
	public Role getRole() {
		if(this.state==0) {
			return Role.ROLE_ADMIN;
		}else {
			return Role.ROLE_USER;
		}
	}
	
}
