package com.example.militaryobjectdetectionsystem.repositories;


import com.example.militaryobjectdetectionsystem.models.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
}

