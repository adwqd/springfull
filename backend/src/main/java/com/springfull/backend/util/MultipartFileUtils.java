package com.springfull.backend.util;

import org.apache.tomcat.util.http.fileupload.disk.DiskFileItem;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;

public class MultipartFileUtils {
    public static MultipartFile urlToMultipartFile(String imageUrl) {
        try {
            URL url = URI.create(imageUrl).toURL();
            URLConnection connection = url.openConnection();
            InputStream inputStream = connection.getInputStream();
            byte[] bytes = inputStream.readAllBytes();
            String fileName = "kakao_profile_" + System.currentTimeMillis() + ".jpg";

            return new ByteArrayMultipartFile(fileName, "image/jpeg", bytes);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}

class ByteArrayMultipartFile implements MultipartFile {
    private final String name;
    private final String contentType;
    private final byte[] content;

    public ByteArrayMultipartFile(String name, String contentType, byte[] content) {
        this.name = name;
        this.contentType = contentType;
        this.content = content;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getOriginalFilename() {
        return name;
    }

    @Override
    public String getContentType() {
        return contentType;
    }

    @Override
    public boolean isEmpty() {
        return content.length == 0;
    }

    @Override
    public long getSize() {
        return content.length;
    }

    @Override
    public byte[] getBytes() throws IOException {
        return content;
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(content);
    }

    @Override
    public void transferTo(File dest) throws IOException {
        try (FileOutputStream fos = new FileOutputStream(dest)) {
            fos.write(content);
        }
    }
}