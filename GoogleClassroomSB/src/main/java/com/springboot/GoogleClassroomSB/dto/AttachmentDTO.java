package com.springboot.GoogleClassroomSB.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class AttachmentDTO {
    private Long id;
    private String fileUrl;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String thumbnailUrl;
}
