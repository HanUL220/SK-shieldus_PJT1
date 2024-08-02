package board.dto;

import lombok.Data;

@Data
public class BoardFileDto {
	private int idx;
	private int boardIdx;
	private String originalFileName;
	private String storedFilePath;
	private String fileSize;
	private String createdDatetime;
	private String creatorId;
	private String updatedDatetime;
	private String updatorId;
	private String deletedYn;
}
