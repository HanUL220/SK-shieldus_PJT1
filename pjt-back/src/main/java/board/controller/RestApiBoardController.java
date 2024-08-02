package board.controller;

import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import board.dto.BoardDto;
import board.dto.BoardFileDto;
import board.dto.BoardListResponse;
import board.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class RestApiBoardController {

	@Autowired
	private BoardService boardService;

	@Operation(summary = "게시판 목록 조회", description = "등록된 게시물 목록을 조회해서 반환합니다.")
	@GetMapping("/board")
	public List<BoardListResponse> openBoardList(HttpServletRequest request) throws Exception {
	    List<BoardDto> boardList = boardService.selectBoardList();

	    List<BoardListResponse> results = new ArrayList<>();
	    boardList.forEach(dto -> {
	        results.add(new BoardListResponse(dto.getBoardIdx(), dto.getTitle(), dto.getHitCnt(), dto.getCreatedDatetime(), dto.getCreatorId(), dto.getFileInfoList()));
	    });

	    return results;
	}

	@Operation(summary = "게시판 등록", description = "게시물 제목과 내용을 저장합니다.")
	@Parameter(name = "boardDto", description = "게시물 정보를 담고 있는 객체", required = true)
	@PostMapping("/board/write")
	public ResponseEntity<String> insertBoard(@RequestPart(value = "data", required = true) BoardDto boardDto,
			@RequestPart(value = "files", required = false) MultipartFile[] files) throws Exception {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String username = auth.getName();
		boardDto.setCreatorId(username);
		boardService.insertBoardWithFile(boardDto, files);
		return ResponseEntity.ok("Board created successfully");
	}

	// 추가 : 이미지 파일 URL을 반환하는 메서드 >> 프론트내에서 이미지를 띄우기 위한 코드
	@GetMapping("/board/file/url/{boardIdx}/{idx}")
	public ResponseEntity<String> getBoardFileUrl(@PathVariable("idx") int idx, @PathVariable("boardIdx") int boardIdx)
			throws Exception {
		BoardFileDto boardFileDto = boardService.selectBoardFileInfo(idx, boardIdx);
		if (ObjectUtils.isEmpty(boardFileDto)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
		}
		String fileUrl = "/api/board/file/" + boardIdx + "/" + idx;
		return ResponseEntity.status(HttpStatus.OK).body(fileUrl);
	}

	@GetMapping("/board/{boardIdx}")
	public ResponseEntity<Object> openBoardDetail(@PathVariable("boardIdx") int boardIdx) throws Exception {
		BoardDto boardDto = boardService.selectBoardDetail(boardIdx);
		if (boardDto == null) {
			Map<String, String> result = new HashMap<>();
			result.put("code", HttpStatus.NOT_FOUND.toString());
			result.put("message", "일치하는 게시물이 존재하지 않습니다.");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
		} else {
			return ResponseEntity.status(HttpStatus.OK).body(boardDto);
		}
	}

	@PutMapping("/board/{boardIdx}")
	public void updateBoard(@PathVariable("boardIdx") int boardIdx, @RequestBody BoardDto boardDto) throws Exception {
		boardDto.setBoardIdx(boardIdx);
		boardService.updateBoard(boardDto);
	}

	@DeleteMapping("/board/{boardIdx}")
	public void deleteBoard(@PathVariable("boardIdx") int boardIdx) throws Exception {
		boardService.deleteBoard(boardIdx);
	}

	@GetMapping("/board/file/{boardIdx}/{idx}")
	public void downloadBoardFile(@PathVariable("idx") int idx, @PathVariable("boardIdx") int boardIdx,
			HttpServletResponse response) throws Exception {
		BoardFileDto boardFileDto = boardService.selectBoardFileInfo(idx, boardIdx);
		if (ObjectUtils.isEmpty(boardFileDto)) {
			return;
		}

		Path path = Paths.get(boardFileDto.getStoredFilePath());
		byte[] file = Files.readAllBytes(path);

		response.setContentType("application/octet-stream");
		response.setContentLength(file.length);
		response.setHeader("Content-Disposition",
				"attachment; fileName=\"" + URLEncoder.encode(boardFileDto.getOriginalFileName(), "UTF-8") + "\";");
		response.setHeader("Content-Transfer-Encoding", "binary");

		response.getOutputStream().write(file);
		response.getOutputStream().flush();
		response.getOutputStream().close();
	}
}