package com.eazyplan.service;

import com.eazyplan.model.Exercise;
import com.eazyplan.model.User;
import com.eazyplan.repository.ExerciseRepository;
import com.eazyplan.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    public ExerciseService(ExerciseRepository exerciseRepository, UserRepository userRepository) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Exercise> getAllExercises(String username) {
        return exerciseRepository.findByUserIdOrderByMuscleGroup(findUser(username).getId());
    }

    @Transactional(readOnly = true)
    public Exercise getExercise(Long id, String username) {
        return exerciseRepository.findById(id)
                .filter(e -> e.getUser().getUsername().equals(username))
                .orElseThrow(() -> new RuntimeException("Ejercicio no encontrado"));
    }

    @Transactional
    public Exercise createExercise(Exercise exercise, String username) {
        exercise.setUser(findUser(username));
        return exerciseRepository.save(exercise);
    }

    @Transactional
    public Exercise updateExercise(Long id, Exercise updated, String username) {
        Exercise exercise = getExercise(id, username);
        exercise.setName(updated.getName());
        exercise.setMuscleGroup(updated.getMuscleGroup());
        exercise.setDescription(updated.getDescription());
        exercise.setSets(updated.getSets());
        exercise.setReps(updated.getReps());
        exercise.setDurationMinutes(updated.getDurationMinutes());
        exercise.setDifficulty(updated.getDifficulty());
        return exerciseRepository.save(exercise);
    }

    @Transactional
    public void deleteExercise(Long id, String username) {
        exerciseRepository.delete(getExercise(id, username));
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
