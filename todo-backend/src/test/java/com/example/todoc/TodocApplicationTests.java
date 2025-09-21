package com.example.todoc;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class TodocApplicationTests {


	@Test
	void mainMethodRuns() {
		Assertions.assertDoesNotThrow(() -> TodocApplication.main(new String[] {}));
	}
}
