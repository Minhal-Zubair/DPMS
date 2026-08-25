package com.dpms.dpmsbackend.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("minhalzubair2027.work@gmail.com", "DPMS System");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("Email sent to: " + to);
        } catch (Exception e) {
            System.err.println("Email failed to " + to + ": " + e.getMessage());
        }
    }

    public void sendApprovalEmail(String to, String name, String appNo) {
        sendEmail(to,
            "Application Approved - " + appNo,
            buildHtml("Application Approved", name,
                "Your application <b>" + appNo + "</b> has been <span style='color:#16a34a'><b>approved</b></span>.",
                "Please log in to the DPMS portal to view more details.",
                "#16a34a"));
    }

    public void sendRejectionEmail(String to, String name, String appNo, String reason) {
        String reasonHtml = (reason != null && !reason.isBlank())
            ? "<br><br><b>Reason:</b> " + reason : "";
        sendEmail(to,
            "Application Update - " + appNo,
            buildHtml("Application Status Update", name,
                "Your application <b>" + appNo + "</b> has been <span style='color:#dc2626'><b>rejected</b></span>." + reasonHtml,
                "Please contact us or log in to the portal for further assistance.",
                "#dc2626"));
    }

    public void sendDocumentVerifiedEmail(String to, String name, String docName, String appNo) {
        sendEmail(to,
            "Document Verified - " + docName,
            buildHtml("Document Verified", name,
                "Your document <b>" + docName + "</b> for application <b>" + appNo + "</b> has been <span style='color:#16a34a'><b>verified</b></span>.",
                "Log in to check the status of your remaining documents.",
                "#16a34a"));
    }

    public void sendDocumentRejectedEmail(String to, String name, String docName, String appNo, String remarks) {
        String remarksHtml = (remarks != null && !remarks.isBlank())
            ? "<br><br><b>Reason:</b> " + remarks : "";
        sendEmail(to,
            "Document Rejected - " + docName,
            buildHtml("Document Requires Attention", name,
                "Your document <b>" + docName + "</b> for application <b>" + appNo + "</b> has been <span style='color:#dc2626'><b>rejected</b></span>." + remarksHtml,
                "Please upload a corrected version via the DPMS portal.",
                "#dc2626"));
    }

    public void sendStatusChangeEmail(String to, String name, String appNo, String status) {
        String color = status.contains("Review") ? "#2563eb"
            : status.contains("Approved") ? "#16a34a"
            : status.contains("Rejected") ? "#dc2626" : "#d97706";
        sendEmail(to,
            "Application Status Updated - " + appNo,
            buildHtml("Status Updated", name,
                "Your application <b>" + appNo + "</b> status is now <span style='color:" + color + "'><b>" + status + "</b></span>.",
                "Log in to the DPMS portal to view full details.",
                color));
    }

    private String buildHtml(String title, String name, String body, String footer, String color) {
        return "<html><body style='margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;'>"
            + "<table width='100%' cellpadding='0' cellspacing='0' style='padding:40px 0;background:#f1f5f9;'>"
            + "<tr><td align='center'>"
            + "<table width='560' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);'>"
            + "<tr><td style='background:" + color + ";padding:28px 36px;'>"
            + "<h1 style='margin:0;color:#ffffff;font-size:22px;'>DPMS</h1>"
            + "<p style='margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;'>Document Processing Management System</p>"
            + "</td></tr>"
            + "<tr><td style='padding:36px;'>"
            + "<h2 style='margin:0 0 8px;color:#1e293b;font-size:20px;'>" + title + "</h2>"
            + "<p style='color:#475569;font-size:15px;margin:0 0 16px;'>Dear " + name + ",</p>"
            + "<p style='color:#475569;font-size:15px;line-height:1.7;margin:0 0 24px;'>" + body + "</p>"
            + "<p style='color:#64748b;font-size:14px;'>" + footer + "</p>"
            + "</td></tr>"
            + "<tr><td style='background:#f8fafc;padding:20px 36px;border-top:1px solid #e2e8f0;'>"
            + "<p style='margin:0;color:#94a3b8;font-size:12px;text-align:center;'>"
            + "2026 DPMS - Document Processing Management System<br>"
            + "This is an automated email, please do not reply."
            + "</p></td></tr>"
            + "</table></td></tr></table>"
            + "</body></html>";
    }
}