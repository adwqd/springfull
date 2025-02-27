package com.springfull.backend.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

public class FileStorageUtil {
	@Value("${com.springfull.upload.path}")
	private static String uploadPath;

    public static String saveMultipartFile(MultipartFile file, String uuid) {
        try {
            // 고유한 파일명 생성
            String fileName = uuid + "_" + file.getOriginalFilename();
            File destinationFile = new File(uploadPath + fileName);

            // 폴더 없으면 생성
            if (!destinationFile.getParentFile().exists()) {
                destinationFile.getParentFile().mkdirs();
            }

            // 파일 저장
            try (FileOutputStream fos = new FileOutputStream(destinationFile)) {
                fos.write(file.getBytes());
            }

            System.out.println("파일 저장 완료: " + destinationFile.getAbsolutePath());
            return fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
