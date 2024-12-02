package com.example.militaryobjectdetectionsystem.controller;

import com.example.militaryobjectdetectionsystem.models.ObjectCount;
import com.example.militaryobjectdetectionsystem.service.ObjectCountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class ObjectCountController {

    private final ObjectCountService objectCountService;



    @Autowired
    public ObjectCountController(ObjectCountService objectCountService) {
        this.objectCountService = objectCountService;
    }

    @GetMapping("/object-counts")
    public ResponseEntity<List<ObjectCount>> getObjectCounts(@RequestParam String email) {
        List<ObjectCount> objectCounts = objectCountService.getObjectCountsByEmail(email);
        return ResponseEntity.ok(objectCounts);
    }

//    @GetMapping("/counts")
//    public ResponseEntity<List<ObjectCount>> getCountsByEmailAndVideoId(
//            @RequestParam String email,
//            @RequestParam Long videoId) {
//        List<ObjectCount> counts = objectCountService.getObjectCountsByEmailAndVideoId(email, videoId);
//        return ResponseEntity.ok(counts);
//    }


    @PostMapping("/object-counts")
    public ResponseEntity<ObjectCount> saveObjectCount(@RequestBody ObjectCount objectCount) {
        ObjectCount savedObjectCount = objectCountService.saveObjectCount(objectCount);
        return ResponseEntity.ok(savedObjectCount);
    }
}