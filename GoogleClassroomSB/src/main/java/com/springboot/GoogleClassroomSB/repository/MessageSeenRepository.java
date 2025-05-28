package com.springboot.GoogleClassroomSB.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.GoogleClassroomSB.entity.GroupchatEntity;
import com.springboot.GoogleClassroomSB.entity.MessageSeenEntity;
import com.springboot.GoogleClassroomSB.entity.MessageSeenId;
import com.springboot.GoogleClassroomSB.entity.UserEntity;
import com.springboot.GoogleClassroomSB.entity.UserGroupEntity;

@Repository
public interface MessageSeenRepository extends JpaRepository<MessageSeenEntity, MessageSeenId> {
	
    List<MessageSeenEntity> findByMessageId(Long messageId);
    boolean existsByMessageIdAndUserId(Long messageId, Long userId);
}

