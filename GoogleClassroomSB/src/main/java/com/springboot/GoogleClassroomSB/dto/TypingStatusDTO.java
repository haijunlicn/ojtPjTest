package com.springboot.GoogleClassroomSB.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TypingStatusDTO {
    private String email;
    private String name;
    private Long groupId;
    private boolean typing;
}
