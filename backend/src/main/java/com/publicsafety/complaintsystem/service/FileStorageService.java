package com.publicsafety.complaintsystem.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "video/mp4");
    private final Path uploadRoot = Paths.get("uploads");

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Unsupported file type");
        }
        try {
            Files.createDirectories(uploadRoot);
            String safeName = UUID.randomUUID() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");
            Path target = uploadRoot.resolve(safeName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return target.toString().replace("\\", "/");
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file", e);
        }
    }
}
