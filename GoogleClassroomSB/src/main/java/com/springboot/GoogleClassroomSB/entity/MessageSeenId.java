package com.springboot.GoogleClassroomSB.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
public class MessageSeenId implements Serializable {

	public MessageSeenId() {}
	
    public MessageSeenId(Long messageId, Long userId) {
        this.messageId = messageId;
        this.userId = userId;
    }
    
	private Long messageId;
    private Long userId;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MessageSeenId)) return false;
        MessageSeenId that = (MessageSeenId) o;
        return Objects.equals(messageId, that.messageId) &&
               Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(messageId, userId);
    }
}


