package com.example.militaryobjectdetectionsystem.service;

import com.example.militaryobjectdetectionsystem.models.ObjectCount;
import com.example.militaryobjectdetectionsystem.repositories.ObjectCountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ObjectCountService {

    private final ObjectCountRepository objectCountRepository;

    @Autowired
    public ObjectCountService(ObjectCountRepository objectCountRepository) {
        this.objectCountRepository = objectCountRepository;
    }

    public List<ObjectCount> getObjectCountsByEmail(String email) {
        return objectCountRepository.findByEmail(email);
    }

    public ObjectCount saveObjectCount(ObjectCount objectCount) {
        return objectCountRepository.save(objectCount);
    }

//    public List<ObjectCount> getObjectCountsByEmailAndVideoId(String email, Long videoId) {
//        return objectCountRepository.findByEmailAndVideoId(email, videoId);
//    }
    public List<ObjectCount> getAllObjectCounts() {
        return objectCountRepository.findAll();
    }
}
