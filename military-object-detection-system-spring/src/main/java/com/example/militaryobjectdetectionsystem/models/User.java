package com.example.militaryobjectdetectionsystem.models;


import jakarta.persistence.*;
import lombok.Data;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@Entity
@Table(name = "users")  // змінили ім'я таблиці на 'app_user'
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Video> videos;
}


