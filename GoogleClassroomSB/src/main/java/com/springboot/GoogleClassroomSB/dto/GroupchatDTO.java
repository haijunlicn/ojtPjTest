package com.springboot.GoogleClassroomSB.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupchatDTO {
	private Long id;
    private String name;
    private String joinCode;
    private Integer memberCount;
    private String role;
}
