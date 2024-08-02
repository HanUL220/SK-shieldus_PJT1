package board.common;

import java.io.File;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import board.dto.BoardFileDto;
import board.entity.BoardFileEntity;

@Component
public class FileUtils {

    @Value("${spring.servlet.multipart.location}")
    private String uploadDir;

    public List<BoardFileEntity> parseFileInfo(MultipartHttpServletRequest request) throws Exception {

        if (ObjectUtils.isEmpty(request)) {
            return null;
        }

        List<BoardFileEntity> fileInfoList = new ArrayList<>();

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd");
        ZonedDateTime now = ZonedDateTime.now();
        String storedDir = uploadDir + now.format(dtf);
        File dir = new File(storedDir);
        if (!dir.exists()) {
            dir.mkdir();
        }

        Iterator<String> fileTagNames = request.getFileNames();
        while (fileTagNames.hasNext()) {
            String fileTagName = fileTagNames.next();
            List<MultipartFile> files = request.getFiles(fileTagName);
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                String contentType = file.getContentType();
                if (ObjectUtils.isEmpty(contentType)) continue;

                String fileExtension = "";
                if (contentType.contains("jpeg")) {
                    fileExtension = ".jpg";
                } else if (contentType.contains("png")) {
                    fileExtension = ".png";
                } else if (contentType.contains("gif")) {
                    fileExtension = ".gif";
                } else if (contentType.contains("pdf")) {
                    fileExtension = ".pdf";
                } else if (contentType.contains("vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                    fileExtension = ".docx";
                } else if (contentType.contains("vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                    fileExtension = ".xlsx";
                } else {
                    continue;
                }

                String storedFileName = System.nanoTime() + fileExtension;

                BoardFileEntity entity = new BoardFileEntity();
                entity.setFileSize(Long.toString(file.getSize()));
                entity.setOriginalFileName(file.getOriginalFilename());
                entity.setStoredFilePath(storedDir + "/" + storedFileName);
                entity.setCreatorId("admin");
                fileInfoList.add(entity);

                dir = new File(storedDir + "/" + storedFileName);
                file.transferTo(dir);
            }
        }

        return fileInfoList;
    }

    public List<BoardFileDto> parseFileInfo(int boardIdx, MultipartHttpServletRequest request) throws Exception {

        if (ObjectUtils.isEmpty(request)) {
            return null;
        }

        List<BoardFileDto> fileInfoList = new ArrayList<>();

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd");
        ZonedDateTime now = ZonedDateTime.now();
        String storedDir = uploadDir + now.format(dtf);
        File dir = new File(storedDir);
        if (!dir.exists()) {
            dir.mkdir();
        }

        Iterator<String> fileTagNames = request.getFileNames();
        while (fileTagNames.hasNext()) {
            String fileTagName = fileTagNames.next();
            List<MultipartFile> files = request.getFiles(fileTagName);
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                String contentType = file.getContentType();
                if (ObjectUtils.isEmpty(contentType)) continue;

                String fileExtension = "";
                if (contentType.contains("jpeg")) {
                    fileExtension = ".jpg";
                } else if (contentType.contains("png")) {
                    fileExtension = ".png";
                } else if (contentType.contains("gif")) {
                    fileExtension = ".gif";
                } else if (contentType.contains("pdf")) {
                    fileExtension = ".pdf";
                } else if (contentType.contains("vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                    fileExtension = ".docx";
                } else if (contentType.contains("vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                    fileExtension = ".xlsx";
                } else {
                    continue;
                }

                String storedFileName = System.nanoTime() + fileExtension;

                BoardFileDto dto = new BoardFileDto();
                dto.setBoardIdx(boardIdx);
                dto.setFileSize("" + file.getSize());
                dto.setOriginalFileName(file.getOriginalFilename());
                dto.setStoredFilePath(storedDir + "/" + storedFileName);
                fileInfoList.add(dto);

                dir = new File(storedDir + "/" + storedFileName);
                file.transferTo(dir);
            }
        }

        return fileInfoList;
    }

    public List<BoardFileDto> parseFileInfo(int boardIdx, MultipartFile[] files) throws Exception {

        if (ObjectUtils.isEmpty(files)) {
            return null;
        }

        List<BoardFileDto> fileInfoList = new ArrayList<>();

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd");
        ZonedDateTime now = ZonedDateTime.now();
        String storedDir = uploadDir + now.format(dtf);
        File dir = new File(storedDir);
        if (!dir.exists()) {
            dir.mkdir();
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String contentType = file.getContentType();
            if (ObjectUtils.isEmpty(contentType)) continue;

            String fileExtension = "";
            if (contentType.contains("jpeg")) {
                fileExtension = ".jpg";
            } else if (contentType.contains("png")) {
                fileExtension = ".png";
            } else if (contentType.contains("gif")) {
                fileExtension = ".gif";
            } else if (contentType.contains("pdf")) {
                fileExtension = ".pdf";
            } else if (contentType.contains("vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                fileExtension = ".docx";
            } else if (contentType.contains("vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                fileExtension = ".xlsx";
            } else {
                continue;
            }

            String storedFileName = System.nanoTime() + fileExtension;

            BoardFileDto dto = new BoardFileDto();
            dto.setBoardIdx(boardIdx);
            dto.setFileSize("" + file.getSize());
            dto.setOriginalFileName(file.getOriginalFilename());
            dto.setStoredFilePath(storedDir + "/" + storedFileName);
            fileInfoList.add(dto);

            dir = new File(storedDir + "/" + storedFileName);
            file.transferTo(dir);
        }

        return fileInfoList;
    }
}