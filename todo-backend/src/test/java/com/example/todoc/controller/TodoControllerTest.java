package com.example.todoc.controller;

import com.example.todoc.model.Todo;
import com.example.todoc.repository.TodoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean   // ✅ new package: org.springframework.boot.test.autoconfigure.override.MockBean
    private TodoRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllTodos() throws Exception {
        Todo todo1 = new Todo(1L, "Task 1", false);
        Todo todo2 = new Todo(2L, "Task 2", true);

        when(repository.findAll()).thenReturn(Arrays.asList(todo1, todo2));

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].task").value("Task 1"))
                .andExpect(jsonPath("$[1].completed").value(true));
    }

    @Test
    void testAddTodo() throws Exception {
        Todo todo = new Todo(null, "New Task", false);
        Todo savedTodo = new Todo(1L, "New Task", false);

        when(repository.save(any(Todo.class))).thenReturn(savedTodo);

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(todo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.task").value("New Task"));
    }

    @Test
    void testUpdateTodo() throws Exception {
        Todo existing = new Todo(1L, "Old Task", false);
        Todo updated = new Todo(1L, "Updated Task", true);

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any(Todo.class))).thenReturn(updated);

        mockMvc.perform(put("/api/todos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.task").value("Updated Task"))
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    void testDeleteTodo() throws Exception {
        doNothing().when(repository).deleteById(1L);

        mockMvc.perform(delete("/api/todos/1"))
                .andExpect(status().isOk());
    }
}
