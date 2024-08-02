package board.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BoardListResponse {
    private int boardIdx;
    private String title;
    private int hitCnt;
    private String createdDatetime;
    private String creatorId;
    
    private List<BoardFileDto> fileInfoList; // 추가 : 첨부파일 모든 정보 요청, 게시물 미리보기 포함
}