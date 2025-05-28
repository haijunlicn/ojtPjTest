package com.springboot.GoogleClassroomSB.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "groupchats")
public class GroupchatEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String joinCode;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    private List<UserGroupEntity> userGroups = new ArrayList<>();

    @OneToMany(mappedBy = "group")
    private List<GroupMessageEntity> messages = new ArrayList<>();
    
    public int getMemberCount() {
        return userGroups != null ? userGroups.size() : 0;
    }

}
