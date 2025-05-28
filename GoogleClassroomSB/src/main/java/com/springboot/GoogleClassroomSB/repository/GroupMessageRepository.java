package com.springboot.GoogleClassroomSB.repository;

import com.springboot.GoogleClassroomSB.entity.GroupMessageEntity;
import com.springboot.GoogleClassroomSB.entity.GroupchatEntity;
import com.springboot.GoogleClassroomSB.entity.UserEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMessageRepository extends JpaRepository<GroupMessageEntity, Long> {

	List<GroupMessageEntity> findByGroupIdOrderByTimestampAsc(Long groupId);

}
