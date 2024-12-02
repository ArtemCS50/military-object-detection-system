package com.example.militaryobjectdetectionsystem.models;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class ObjectCount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String label;
    private Integer count;

//    @ManyToOne
//    @JoinColumn(name = "video_id", nullable = false) // Зв'язок з відео
//    private Video video;
//    @ManyToOne
//    @JoinColumn(name = "image_id", nullable = false) // Зв'язок з відео
//    private Image image;
}



