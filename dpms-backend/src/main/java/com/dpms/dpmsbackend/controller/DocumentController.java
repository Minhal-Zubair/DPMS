package com.dpms.dpmsbackend.controller;


import com.dpms.dpmsbackend.entity.Document;
import com.dpms.dpmsbackend.service.DocumentService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping("/api/documents")
@CrossOrigin
public class DocumentController {


    private final DocumentService service;



    public DocumentController(
            DocumentService service
    ){
        this.service=service;
    }




    @PostMapping("/upload")

    public String upload(

            @RequestParam("applicationId")
            Long applicationId,


            @RequestParam("userId")
            Long userId,


            @RequestParam("documentTypeId")
            Integer documentTypeId,


            @RequestPart("file")
            MultipartFile file





    ){

        System.out.println("========== DOCUMENT UPLOAD API HIT ==========");

        System.out.println("Application ID: " + applicationId);
        System.out.println("User ID: " + userId);
        System.out.println("Document Type ID: " + documentTypeId);
        System.out.println("File: " + file.getOriginalFilename());
        try{

//            System.out.println("File Name : " + file.getOriginalFilename());
//            System.out.println("Size : " + file.getSize());
//            System.out.println("Type : " + file.getContentType());
//            byte[] base64Bytes = Base64.getEncoder().encode(file.getBytes());
//            System.out.println(STR."file: \{Arrays.toString(base64Bytes)}");


            service.uploadDocument(
                    applicationId,
                    userId,
                    documentTypeId,
                    file
            );
        }catch(Exception ex){
            System.out.println(ex);
        }






        return "Uploaded successfully";


    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<?> getDocumentsByApplication(
            @PathVariable Long applicationId
    ) {
        return ResponseEntity.ok(
                service.getDocuments(applicationId)
        );
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyDocument(
            @PathVariable Long id,
            @RequestParam Boolean verified,
            @RequestParam(required = false, defaultValue = "") String remarks
    ) {
        service.verifyDocument(id, verified, remarks);
        return ResponseEntity.ok("Document " + (verified ? "verified" : "rejected"));
    }

    @GetMapping("/{id}/view")
    public ResponseEntity<byte[]> viewDocument(
            @PathVariable Long id
    ) {
        Document document = service.getDocument(id);
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(document.getFileData());
    }
}