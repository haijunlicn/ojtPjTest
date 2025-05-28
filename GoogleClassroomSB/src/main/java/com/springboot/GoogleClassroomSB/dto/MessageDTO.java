package com.springboot.GoogleClassroomSB.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MessageDTO {
    private Long id;
    private Long groupId;
    private String content;
    private String timestamp;
    private UserDTO sender;
    private List<SeenNotificationDTO> seenBy;
    private List<AttachmentDTO> attachments;
}
