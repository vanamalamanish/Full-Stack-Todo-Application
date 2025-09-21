package com.example.todoc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.todoc.model.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {

}
