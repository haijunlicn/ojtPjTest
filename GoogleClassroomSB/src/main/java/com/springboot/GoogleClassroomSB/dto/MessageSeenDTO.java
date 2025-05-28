package com.springboot.GoogleClassroomSB.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageSeenDTO {
    private Long messageId;
    private String userEmail;
}

