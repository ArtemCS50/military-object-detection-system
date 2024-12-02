package com.example.militaryobjectdetectionsystem.controller;

import com.example.militaryobjectdetectionsystem.dto.ObjectCountDto;
import com.example.militaryobjectdetectionsystem.models.ObjectCount;
import com.example.militaryobjectdetectionsystem.models.User;
import com.example.militaryobjectdetectionsystem.repositories.ObjectCountRepository;
import com.example.militaryobjectdetectionsystem.service.ImageService;
import com.example.militaryobjectdetectionsystem.service.UserService;
import com.example.militaryobjectdetectionsystem.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ObjectCountRepository objectCountRepository;
    @Autowired
    private ImageService imageService;
    @Autowired
    private UserService userService;



    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam MultipartFile file,
            @RequestParam String email) {
        try {
            Optional<User> user = userService.findByEmail(email);
            if (user.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            imageService.saveImage(file, user.get());
            return ResponseEntity.ok("Video uploaded successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving video: " + e.getMessage());
        }
    }

    @PostMapping("/save-counts")
    public ResponseEntity<String> saveCounts(@RequestBody ObjectCountDto counts) {
//            Optional<Video> video = videoService.findById(counts.getVideoId());
//            if (video.isEmpty()) {
//                return ResponseEntity.status(404).body("Video not found");
//            }

        counts.getCounts().forEach((label, count) -> {
            ObjectCount objectCount = new ObjectCount();
            objectCount.setEmail(counts.getEmail());
            objectCount.setLabel(label);
            objectCount.setCount(count);
//                objectCount.setVideo(video.get());
            objectCountRepository.save(objectCount);
        });

        return ResponseEntity.ok("Counts saved successfully");
    }




}

