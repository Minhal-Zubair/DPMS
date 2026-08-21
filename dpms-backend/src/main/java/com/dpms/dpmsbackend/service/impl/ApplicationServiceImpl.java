package com.dpms.dpmsbackend.service.impl;
import com.dpms.dpmsbackend.dto.AdminApplicationDTO;
import com.dpms.dpmsbackend.dto.ApplicationRequest;
import com.dpms.dpmsbackend.entity.Application;
import com.dpms.dpmsbackend.entity.Product;
import com.dpms.dpmsbackend.entity.User;
import com.dpms.dpmsbackend.repository.ApplicationRepository;
import com.dpms.dpmsbackend.service.ApplicationService;
import com.dpms.dpmsbackend.repository.UserRepository;
import com.dpms.dpmsbackend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import com.dpms.dpmsbackend.dto.ApplicationDetailsDTO;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository repository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    public ApplicationServiceImpl(
            ApplicationRepository repository,
            UserRepository userRepository,
            ProductRepository productRepository
    ){
        this.repository = repository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Application createApplication(
            ApplicationRequest request,
            Long userId
    ){
        Application application = new Application();
        application.setApplicationNumber(
                "APP-" + System.currentTimeMillis()
        );


        application.setUserId(userId);

        application.setCnic(
                request.getCnic()
        );


        application.setProductionDate(
                request.getProductionDate()
        );


        application.setProductId(
                request.getProductId()
        );


        application.setRemarks(
                request.getRemarks()
        );


        application.setStatus(
                Application.Status.Submitted
        );


        return repository.save(application);

    }



    @Override
    public List<Application> getUserApplications(
            Long userId
    ){

        return repository.findByUserId(userId);

    }

    @Override
    public Application updateApplication(
            Long id,
            ApplicationRequest request
    ) {

        Application application =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        application.setCnic(request.getCnic());

        application.setProductionDate(
                request.getProductionDate()
        );

        application.setProductId(
                request.getProductId()
        );

        application.setRemarks(
                request.getRemarks()
        );

        return repository.save(application);
    }

    @Override
    public long getTotalApplications() {

        return repository.count();

    }



    @Override
    public long getApprovedApplications() {

        return repository.countByStatus(
                Application.Status.Approved
        );

    }



    @Override
    public long getRejectedApplications() {

        return repository.countByStatus(
                Application.Status.Rejected
        );

    }



    @Override
    public long getPendingApplications() {

        return repository.countByStatus(
                Application.Status.Submitted
        );

    }



    @Override
    public List<Application> getRecentApplications() {

        return repository
                .findTop5ByOrderByCreatedAtDesc();

    }
    @Override
    public List<AdminApplicationDTO> getAllApplications() {
        List<Application> applications =
                repository.findAllByOrderByCreatedAtDesc();
        List<AdminApplicationDTO> list = new ArrayList<>();
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd MMM yyyy");
        for(Application app : applications){
            AdminApplicationDTO dto =
                    new AdminApplicationDTO();
            dto.setId(app.getId());
            dto.setApplicationNumber(
                    app.getApplicationNumber()
            );
            User user =
                    userRepository.findById(app.getUserId())
                            .orElse(null);
            if(user!=null){
                dto.setApplicant(
                        user.getFirstName()+" "+user.getLastName()
                );
            }else{
                dto.setApplicant("Unknown");
            }
            dto.setCnic(app.getCnic());
            Product product =
                    productRepository.findById(app.getProductId())
                            .orElse(null);
            dto.setProduct(
                    product==null?
                            "N/A":
                            product.getProductName()
            );
            if (app.getProductionDate() != null) {
                dto.setProductionDate(
                        app.getProductionDate().toString()
                );
            }
            dto.setSubmittedDate(
                    app.getCreatedAt().format(formatter)
            );
            dto.setStatus(
                    app.getStatus().name().replace("_"," ")
            );
            list.add(dto);
        }
        return list;
    }
    @Override
    public void updateStatus(Long applicationId,
                             String status) {

        Application application =
                repository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        application.setStatus(

                Application.Status.valueOf(
                        status.replace(" ", "_")
                )

        );

        repository.save(application);

    }
    @Override
    public ApplicationDetailsDTO getApplication(Long id) {

        Application application = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));

        ApplicationDetailsDTO dto = new ApplicationDetailsDTO();

        dto.setId(application.getId());

        dto.setProductId(application.getProductId());

        dto.setApplicationNumber(application.getApplicationNumber());

        dto.setCnic(application.getCnic());

        dto.setRemarks(application.getRemarks());

        dto.setStatus(
                application.getStatus()
                        .name()
                        .replace("_", " ")
        );

        if (application.getProductionDate() != null) {

            dto.setProductionDate(
                    application.getProductionDate().toString()
            );
        }
        if (application.getCreatedAt() != null) {
            dto.setSubmittedDate(
                    application.getCreatedAt()
                            .format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
            );
        }
        User user = userRepository.findById(application.getUserId())
                .orElse(null);
        if (user != null) {
            dto.setApplicant(
                    user.getFirstName() + " " + user.getLastName()
            );
            dto.setEmail(user.getEmail());
            dto.setPhone(user.getPhone());
        } else {
            dto.setApplicant("Unknown");
            dto.setEmail("N/A");
            dto.setPhone("N/A");
        }
        Product product = productRepository.findById(application.getProductId())
                .orElse(null);
        if (product != null) {
            dto.setProduct(product.getProductName());
        } else {
            dto.setProduct("N/A");
        }
        return dto;
    }



}