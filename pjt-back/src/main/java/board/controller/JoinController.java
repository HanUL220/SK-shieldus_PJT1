package board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import board.dto.JoinDto;
import board.service.JoinService;

@RestController
public class JoinController {
    @Autowired
    JoinService joinService;
    
    @PostMapping("/joinProc")
    public ResponseEntity<?> joinProc(@RequestBody JoinDto joinDto) {
        if (joinService.joinProcess(joinDto)) {
            return ResponseEntity.ok().body("User registered successfully"); // 추가 : 클라이언트에게 응답을 반환
        } else {
            return ResponseEntity.badRequest().body("User registration failed"); // 추가 : 클라이언트에게 응답을 반환
        }
    }
}