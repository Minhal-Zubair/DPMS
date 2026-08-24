package com.dpms.dpmsbackend.service;

import com.dpms.dpmsbackend.dto.ExtractionResultDTO;
import com.dpms.dpmsbackend.entity.Document;
import com.dpms.dpmsbackend.entity.DocumentExtraction;
import com.dpms.dpmsbackend.repository.ApplicationRepository;
import com.dpms.dpmsbackend.repository.DocumentExtractionRepository;
import com.dpms.dpmsbackend.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

@Service
public class DocumentAIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final DocumentRepository documentRepository;
    private final DocumentExtractionRepository extractionRepository;
    private final ApplicationRepository applicationRepository;

    public DocumentAIService(
            DocumentRepository documentRepository,
            DocumentExtractionRepository extractionRepository,
            ApplicationRepository applicationRepository
    ) {
        this.documentRepository = documentRepository;
        this.extractionRepository = extractionRepository;
        this.applicationRepository = applicationRepository;
    }

    public ExtractionResultDTO analyzeDocument(Long documentId) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        DocumentExtraction extraction = extractionRepository
                .findByDocumentId(documentId)
                .orElse(new DocumentExtraction());

        extraction.setDocumentId(documentId);
        extraction.setApplicationId(doc.getApplicationId());

        try {
            String mediaType = detectMediaType(doc.getOriginalName());
            String base64Image = Base64.getEncoder().encodeToString(doc.getFileData());

            // Gemini API request body
            String requestBody = "{"
                + "\"contents\": [{"
                + "  \"parts\": ["
                + "    {\"inline_data\": {"
                + "      \"mime_type\": \"" + mediaType + "\","
                + "      \"data\": \"" + base64Image + "\""
                + "    }},"
                + "    {\"text\": \"Analyze this document image and extract information. Respond ONLY with a valid JSON object, no markdown, no extra text. Format: {\\\"documentType\\\": \\\"CNIC or SALARY_SLIP or BANK_STATEMENT or DRIVING_LICENSE or PHOTOGRAPH or OTHER\\\",\\\"extractedName\\\": \\\"full name or null\\\",\\\"extractedCnic\\\": \\\"CNIC as XXXXX-XXXXXXX-X or null\\\",\\\"extractedDate\\\": \\\"any date found or null\\\",\\\"extractedSalary\\\": \\\"salary amount or null\\\",\\\"extractedAccount\\\": \\\"account number or null\\\",\\\"isReadable\\\": true or false}\"}"
                + "  ]"
                + "}]"
                + "}";

            // Use Gemini 1.5 Flash Latest
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .header("x-goog-api-key", apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());

            System.out.println("Gemini API status: " + response.statusCode());
            System.out.println("Gemini response: " + response.body());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Gemini API error: " + response.body());
            }

            // Extract text from Gemini response
            // Response format: {"candidates":[{"content":{"parts":[{"text":"..."}]}}]}
            String body = response.body();
            int textStart = body.indexOf("\"text\":");
            if (textStart == -1) throw new RuntimeException("No text in Gemini response");

            int quoteStart = body.indexOf("\"", textStart + 7);
            int quoteEnd = findEndQuote(body, quoteStart + 1);
            String rawText = body.substring(quoteStart + 1, quoteEnd)
                    .replace("\\n", " ")
                    .replace("\\\"", "\"")
                    .replace("\\\\", "\\");

            extraction.setRawExtraction(rawText);
            System.out.println("Extracted text: " + rawText);

            // Clean JSON
            String jsonStr = rawText.trim()
                    .replaceAll("^```json\\s*", "")
                    .replaceAll("^```\\s*", "")
                    .replaceAll("\\s*```$", "")
                    .trim();

            boolean isReadable = !jsonStr.contains("\"isReadable\": false")
                    && !jsonStr.contains("\"isReadable\":false");

            if (!isReadable) {
                extraction.setExtractionStatus("UNREADABLE");
            } else {
                extraction.setDetectedType(extractField(jsonStr, "documentType"));
                extraction.setExtractedName(extractField(jsonStr, "extractedName"));
                extraction.setExtractedCnic(extractField(jsonStr, "extractedCnic"));
                extraction.setExtractedDate(extractField(jsonStr, "extractedDate"));
                extraction.setExtractedSalary(extractField(jsonStr, "extractedSalary"));
                extraction.setExtractedAccount(extractField(jsonStr, "extractedAccount"));
                extraction.setExtractionStatus("SUCCESS");

                crossCheckCnic(extraction, doc.getApplicationId());
            }

        } catch (Exception e) {
            System.err.println("AI extraction failed: " + e.getMessage());
            e.printStackTrace();
            extraction.setExtractionStatus("FAILED");
            String errMsg = "Extraction failed: " + e.getMessage();
            extraction.setMismatchReason(errMsg.length() > 490 ? errMsg.substring(0, 490) : errMsg);
        }

        extractionRepository.save(extraction);
        return toDTO(extraction);
    }

    // Find the end of a JSON string value (handles escaped quotes)
    private int findEndQuote(String s, int start) {
        for (int i = start; i < s.length(); i++) {
            if (s.charAt(i) == '\\') { i++; continue; }
            if (s.charAt(i) == '"') return i;
        }
        return s.length() - 1;
    }

    private String extractField(String json, String key) {
        String search = "\"" + key + "\"";
        int idx = json.indexOf(search);
        if (idx == -1) return null;
        int colon = json.indexOf(":", idx + search.length());
        if (colon == -1) return null;
        String rest = json.substring(colon + 1).trim();
        if (rest.startsWith("null")) return null;
        if (rest.startsWith("\"")) {
            int end = findEndQuote(rest, 1);
            String val = rest.substring(1, end);
            return val.equalsIgnoreCase("null") || val.isBlank() ? null : val;
        }
        int end = rest.indexOf(",");
        if (end == -1) end = rest.indexOf("}");
        if (end == -1) return rest.trim();
        return rest.substring(0, end).trim();
    }

    private void crossCheckCnic(DocumentExtraction extraction, Long applicationId) {
        if (extraction.getExtractedCnic() == null) return;
        applicationRepository.findById(applicationId).ifPresent(app -> {
            if (app.getCnic() == null) return;
            String docCnic = extraction.getExtractedCnic().replaceAll("[^0-9]", "");
            String appCnic = app.getCnic().replaceAll("[^0-9]", "");
            if (docCnic.equals(appCnic)) {
                extraction.setCnicMatch(true);
            } else {
                extraction.setCnicMatch(false);
                extraction.setMismatchReason(
                    "CNIC mismatch: document shows " + extraction.getExtractedCnic()
                    + " but application has " + app.getCnic()
                );
            }
        });
    }

    private String detectMediaType(String filename) {
        if (filename == null) return "image/jpeg";
        String lower = filename.toLowerCase();
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".pdf")) return "application/pdf";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".gif")) return "image/gif";
        return "image/jpeg";
    }

    private ExtractionResultDTO toDTO(DocumentExtraction e) {
        ExtractionResultDTO dto = new ExtractionResultDTO();
        dto.setDocumentId(e.getDocumentId());
        dto.setDetectedType(e.getDetectedType());
        dto.setExtractedName(e.getExtractedName());
        dto.setExtractedCnic(e.getExtractedCnic());
        dto.setExtractedDate(e.getExtractedDate());
        dto.setExtractedSalary(e.getExtractedSalary());
        dto.setExtractedAccount(e.getExtractedAccount());
        dto.setCnicMatch(e.getCnicMatch());
        dto.setMismatchReason(e.getMismatchReason());
        dto.setExtractionStatus(e.getExtractionStatus());
        dto.setRawExtraction(e.getRawExtraction());
        return dto;
    }
}