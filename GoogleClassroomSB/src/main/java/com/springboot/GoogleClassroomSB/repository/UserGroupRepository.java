package com.springboot.GoogleClassroomSB.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.GoogleClassroomSB.entity.GroupchatEntity;
import com.springboot.GoogleClassroomSB.entity.UserEntity;
import com.springboot.GoogleClassroomSB.entity.UserGroupEntity;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroupEntity, Long> {

	boolean existsByUserAndGroup(UserEntity user, GroupchatEntity groupChat);

	Optional<UserGroupEntity> findByUserIdAndGroupId(Long userId, Long groupId);
}
