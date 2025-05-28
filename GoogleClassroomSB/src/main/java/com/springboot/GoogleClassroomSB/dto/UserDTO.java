package com.springboot.GoogleClassroomSB.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserDTO {
	private Long id;
	private String name;
    private String email;
    private List<GroupchatDTO> createdGroups;
    private List<GroupchatDTO> joinedGroups;
}
