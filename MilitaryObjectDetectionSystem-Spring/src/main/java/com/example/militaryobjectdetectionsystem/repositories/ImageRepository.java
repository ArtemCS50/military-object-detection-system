package com.example.militaryobjectdetectionsystem.repositories;

import com.example.militaryobjectdetectionsystem.models.Image;
import com.example.militaryobjectdetectionsystem.models.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
}