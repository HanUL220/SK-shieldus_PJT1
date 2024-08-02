package board.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
	@PostMapping("/loginProc")
	public String login() {
		return null;
	}
}