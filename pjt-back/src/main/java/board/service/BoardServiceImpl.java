package board.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import board.common.FileUtils;
import board.dto.BoardDto;
import board.dto.BoardFileDto;
import board.mapper.BoardMapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Transactional
@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    private BoardMapper boardMapper;

    @Autowired
    private FileUtils fileUtils;

    @Override
    public List<BoardDto> selectBoardList() {
        List<BoardDto> boardList = boardMapper.selectBoardList();
        boardList.forEach(boardDto -> {
            List<BoardFileDto> boardFileInfo = boardMapper.selectBoardFileList(boardDto.getBoardIdx());
            boardDto.setFileInfoList(boardFileInfo);
            log.debug("Board ID: " + boardDto.getBoardIdx() + " File Info List: " + boardFileInfo);
        });
        return boardList;
    }

    @Override
    public void insertBoard(BoardDto boardDto, MultipartHttpServletRequest request) throws Exception {
//    	로그인한 사용자의 정보를 가져와 동일한 사용자만 게시물 수정 및 삭제 하기 위함
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boardDto.setCreatorId(username);
        boardMapper.insertBoard(boardDto);

        List<BoardFileDto> fileInfoList = fileUtils.parseFileInfo(boardDto.getBoardIdx(), request);

        if (!CollectionUtils.isEmpty(fileInfoList)) {
            boardMapper.insertBoardFileList(fileInfoList);
        }
    }

    @Override
    public BoardDto selectBoardDetail(int boardIdx) {
        boardMapper.updateHitCount(boardIdx);

        BoardDto boardDto = boardMapper.selectBoardDetail(boardIdx);
        if (boardDto != null) {
            List<BoardFileDto> boardFileInfo = boardMapper.selectBoardFileList(boardIdx);
            boardDto.setFileInfoList(boardFileInfo);
        }

        return boardDto;
    }

    @Override
    public void updateBoard(BoardDto boardDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boardDto.setUpdatorId(username);
        boardMapper.updateBoard(boardDto);
    }

    @Override
    public void deleteBoard(int boardIdx) {
        BoardDto boardDto = new BoardDto();
        boardDto.setBoardIdx(boardIdx);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boardDto.setUpdatorId(username);
        boardMapper.deleteBoard(boardDto);
    }

    @Override
    public BoardFileDto selectBoardFileInfo(int idx, int boardIdx) {
        return boardMapper.selectBoardFileInfo(idx, boardIdx);
    }

    @Override
    public void insertBoardWithFile(BoardDto boardDto, MultipartFile[] files) throws Exception {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boardDto.setCreatorId(username);
        boardMapper.insertBoard(boardDto);

        List<BoardFileDto> fileInfoList = fileUtils.parseFileInfo(boardDto.getBoardIdx(), files);

        if (!CollectionUtils.isEmpty(fileInfoList)) {
            boardMapper.insertBoardFileList(fileInfoList);
        }
    }
}