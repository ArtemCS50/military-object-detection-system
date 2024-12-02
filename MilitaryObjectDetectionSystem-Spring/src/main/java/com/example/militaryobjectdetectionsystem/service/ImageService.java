package com.example.militaryobjectdetectionsystem.service;

import com.example.militaryobjectdetectionsystem.models.*;
import com.example.militaryobjectdetectionsystem.repositories.ImageRepository;;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;


import com.example.militaryobjectdetectionsystem.models.User;

@Service
public class ImageService {
    private final ImageRepository imageRepository;

    @Value("${upload.dir}")
    private String uploadDir; // Директорія для збереження файлів

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

//    public Optional<Video> findById(Long id) {
//        return videoRepository.findById(id);
//    }

    public Image saveImage(MultipartFile file, User user) throws IOException {
        // Створення директорії, якщо вона не існує
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Збереження файлу у файловій системі
        String filePath = uploadDir + File.separator + file.getOriginalFilename();
        file.transferTo(new File(filePath));

        // Збереження інформації про файл у базі даних
        Image image = new Image();
        image.setFilename(file.getOriginalFilename());
        image.setUploadDate(LocalDateTime.now());
//        video.setVideoData(file.getBytes()); // Зберігаємо відео в БД (можна зберігати шлях)
        image.setUser(user); // Встановлюємо користувача, який завантажив
        return imageRepository.save(image);
    }
}
