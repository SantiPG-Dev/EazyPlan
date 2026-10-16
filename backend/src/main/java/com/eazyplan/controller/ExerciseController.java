package com.eazyplan.controller;

import com.eazyplan.model.Exercise;
import com.eazyplan.service.ExerciseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exercises")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public List<Exercise> list(@RequestHeader("Authorization") String auth) {
        return exerciseService.getAllExercises(extractUsername(auth));
    }

    @GetMapping("/{id}")
    public Exercise get(@PathVariable Long id, @RequestHeader("Authorization") String auth) {
        return exerciseService.getExercise(id, extractUsername(auth));
    }

    @PostMapping
    public Exercise create(@Valid @RequestBody Exercise exercise, @RequestHeader("Authorization") String auth) {
        return exerciseService.createExercise(exercise, extractUsername(auth));
    }

    @PutMapping("/{id}")
    public Exercise update(@PathVariable Long id, @Valid @RequestBody Exercise exercise,
                           @RequestHeader("Authorization") String auth) {
        return exerciseService.updateExercise(id, exercise, extractUsername(auth));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestHeader("Authorization") String auth) {
        exerciseService.deleteExercise(id, extractUsername(auth));
        return ResponseEntity.noContent().build();
    }

    private String extractUsername(String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new RuntimeException("Token no proporcionado");
        }
        return auth.substring(7);
    }
}
