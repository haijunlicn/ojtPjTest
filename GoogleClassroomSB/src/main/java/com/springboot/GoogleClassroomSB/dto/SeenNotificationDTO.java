package com.springboot.GoogleClassroomSB.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeenNotificationDTO {
    private Long messageId;
    private Long userId;
    private String userName;
    private Long groupId;
    // private LocalDateTime seenAt;
}
