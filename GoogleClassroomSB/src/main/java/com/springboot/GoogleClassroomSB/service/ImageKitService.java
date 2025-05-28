package com.springboot.GoogleClassroomSB.service;

import com.springboot.GoogleClassroomSB.util.MultipartInputStreamFileResource;
import lombok.RequiredArgsConstructor;
import java.util.Base64;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ImageKitService {

    @Value("${imagekit.publicKey}")
    private String publicKey;

    @Value("${imagekit.privateKey}")
    private String privateKey;

    @Value("${imagekit.urlEndpoint}")
    private String urlEndpoint;

    private static final String UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

    public Map<String, Object> uploadFile(MultipartFile file) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        // Fix: only privateKey is needed with trailing colon
        String auth = privateKey + ":";
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
        
        System.out.println("Encoded Auth: Basic " + encodedAuth);


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.add("Authorization", "Basic " + encodedAuth);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));
        body.add("fileName", file.getOriginalFilename());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(UPLOAD_URL, requestEntity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new Exception("ImageKit upload failed: " + response.getStatusCode() + " - " + response.getBody());
        }
    }
    
}

