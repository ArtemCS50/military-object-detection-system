package com.example.militaryobjectdetectionsystem.repositories;

import com.example.militaryobjectdetectionsystem.models.ObjectCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObjectCountRepository extends JpaRepository<ObjectCount, Long> {
//    List<ObjectCount> findByUserEmail(String email);
    List<ObjectCount> findByEmail(String email);

//    @Query("SELECT o FROM ObjectCount o WHERE o.email = :email AND o.video.id = :videoId")
//    List<ObjectCount> findByEmailAndVideoId(@Param("email") String email, @Param("videoId") Long videoId);

}