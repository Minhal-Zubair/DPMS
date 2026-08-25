package com.dpms.dpmsbackend.service.impl;
import com.dpms.dpmsbackend.dto.AdminApplicationDTO;
import com.dpms.dpmsbackend.dto.ApplicationRequest;
import com.dpms.dpmsbackend.entity.Application;
import com.dpms.dpmsbackend.entity.Product;
import com.dpms.dpmsbackend.entity.User;
import com.dpms.dpmsbackend.repository.ApplicationRepository;
import com.dpms.dpmsbackend.service.ActivityLogService;
import com.dpms.dpmsbackend.service.ApplicationLogService;
import com.dpms.dpmsbackend.service.EmailService;
import com.dpms.dpmsbackend.service.ApplicationService;
import com.dpms.dpmsbackend.repository.UserRepository;
import com.dpms.dpmsbackend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import com.dpms.dpmsbackend.dto.ApplicationDetailsDTO;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository repository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ApplicationLogService logService;
    private final ActivityLogService activityLogService;
    private final EmailService emailService;

    public ApplicationServiceImpl(
            ApplicationRepository repository,
            UserRepository userRepository,
            ProductRepository productRepository,
            ApplicationLogService logService,
            ActivityLogService activityLogService,
            EmailService emailService
    ){
        this.repository = repository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.logService = logService;
        this.activityLogService = activityLogService;
        this.emailService = emailService;
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

        Application saved = repository.save(application);

        logService.saveLog(
                saved.getId(),
                userId,
                "APPLICATION_SUBMITTED",
                "Application submitted successfully."
        );

        activityLogService.log(
                "APPLICATION_SUBMITTED",
                "New application submitted",
                userId,
                saved.getId()
        );

        return saved;

    }

    @Override
    public Application saveDraft(ApplicationRequest request, Long userId) {
        Application application = new Application();
        application.setApplicationNumber("APP-" + System.currentTimeMillis());
        application.setUserId(userId);
        if (request.getCnic() != null)
            application.setCnic(request.getCnic().replaceAll("-", ""));
        if (request.getProductionDate() != null)
            application.setProductionDate(request.getProductionDate());
        if (request.getProductId() != null)
            application.setProductId(request.getProductId());
        application.setRemarks(request.getRemarks());
        application.setStatus(Application.Status.Draft);
        Application saved = repository.save(application);
        activityLogService.log("APPLICATION_DRAFT", "Application saved as draft", userId, saved.getId());
        return saved;
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
            if (app.getUserId() != null) {
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
            } else {
                dto.setApplicant("Unknown");
            }
            dto.setCnic(app.getCnic());
            if (app.getProductId() != null) {
                Product product =
                        productRepository.findById(app.getProductId())
                                .orElse(null);
                dto.setProduct(
                        product==null?
                                "N/A":
                                product.getProductName()
                );
            } else {
                dto.setProduct("N/A");
            }
            if (app.getProductionDate() != null) {
                dto.setProductionDate(
                        app.getProductionDate().toString()
                );
            }
            dto.setSubmittedDate(
                    app.getCreatedAt() != null
                            ? app.getCreatedAt().format(formatter)
                            : "-"
            );
            dto.setStatus(
                    app.getStatus().name().replace("_"," ")
            );

            // SLA calculation — count days since submission
            boolean closed = app.getStatus() == Application.Status.Approved
                    || app.getStatus() == Application.Status.Rejected;

            long days = 0;
            if (app.getCreatedAt() != null) {
                LocalDateTime end = closed && app.getUpdatedAt() != null
                        ? app.getUpdatedAt()
                        : LocalDateTime.now();
                days = ChronoUnit.DAYS.between(app.getCreatedAt(), end);
            }
            dto.setDaysInProgress(days);
            dto.setOverdue(!closed && days > 5);

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

        Application.Status newStatus =
                Application.Status.valueOf(status.replace(" ", "_"));

        application.setStatus(newStatus);

        repository.save(application);

        logService.saveLog(
                applicationId,
                null,
                "STATUS_CHANGED",
                "Application status updated to: " + newStatus.name().replace("_", " ")
        );

        activityLogService.log(
                "STATUS_CHANGED",
                "Application status changed to " + newStatus.name().replace("_", " "),
                null,
                applicationId
        );

        // Send email notification to applicant
        if (application.getUserId() != null) {
            userRepository.findById(application.getUserId()).ifPresent(user -> {
                if (user.getEmail() != null && !user.getEmail().isBlank()) {
                    String fullName = user.getFirstName() + " " + user.getLastName();
                    if (newStatus == Application.Status.Approved) {
                        emailService.sendApprovalEmail(
                            user.getEmail(), fullName, application.getApplicationNumber()
                        );
                    } else if (newStatus == Application.Status.Rejected) {
                        emailService.sendRejectionEmail(
                            user.getEmail(), fullName, application.getApplicationNumber(),
                            application.getRemarks()
                        );
                    } else {
                        emailService.sendStatusChangeEmail(
                            user.getEmail(), fullName, application.getApplicationNumber(),
                            newStatus.name().replace("_", " ")
                        );
                    }
                }
            });
        }
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