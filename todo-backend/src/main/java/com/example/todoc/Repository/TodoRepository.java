package com.example.todoc.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.todoc.Model.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {

}
