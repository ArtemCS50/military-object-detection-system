package com.example.militaryobjectdetectionsystem.service;


import com.example.militaryobjectdetectionsystem.models.User;
import com.example.militaryobjectdetectionsystem.models.Video;
import com.example.militaryobjectdetectionsystem.repositories.UserRepository;
import com.example.militaryobjectdetectionsystem.repositories.VideoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class VideoService {
    private final VideoRepository videoRepository;

    @Value("${upload.dir}")
    private String uploadDir; // Директорія для збереження файлів

    public VideoService(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

//    public Optional<Video> findById(Long id) {
//        return videoRepository.findById(id);
//    }

    public Video saveVideo(MultipartFile file, User user) throws IOException {
        // Створення директорії, якщо вона не існує
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Збереження файлу у файловій системі
        String filePath = uploadDir + File.separator + file.getOriginalFilename();
        file.transferTo(new File(filePath));

        // Збереження інформації про файл у базі даних
        Video video = new Video();
        video.setFilename(file.getOriginalFilename());
        video.setUploadDate(LocalDateTime.now());
//        video.setVideoData(file.getBytes()); // Зберігаємо відео в БД (можна зберігати шлях)
        video.setUser(user); // Встановлюємо користувача, який завантажив
        return videoRepository.save(video);
    }
}

