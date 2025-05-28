package com.springboot.GoogleClassroomSB.repository;

import com.springboot.GoogleClassroomSB.entity.GroupchatEntity;
import com.springboot.GoogleClassroomSB.entity.UserEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupchatRepository extends JpaRepository<GroupchatEntity, Long> {
	
    boolean existsByJoinCode(String joinCode);
    
    Optional<GroupchatEntity> findByJoinCode(String joinCode);
    
    // Groups where the user is in the user_group junction table
    @Query("SELECT g FROM GroupchatEntity g JOIN g.userGroups ug WHERE ug.user = :user AND ug.role = 'MEMBER'")
    List<GroupchatEntity> findGroupsJoinedByUser(UserEntity user);

    // Groups where the user is the creator
    @Query("SELECT g FROM GroupchatEntity g JOIN g.userGroups ug WHERE ug.user = :user AND ug.role = 'ADMIN'")
    List<GroupchatEntity> findGroupsCreatedByUser(UserEntity user);
}
