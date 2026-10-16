package com.eazyplan.service;

import com.eazyplan.model.Diet;
import com.eazyplan.model.User;
import com.eazyplan.repository.DietRepository;
import com.eazyplan.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DietService {

    private final DietRepository dietRepository;
    private final UserRepository userRepository;

    public DietService(DietRepository dietRepository, UserRepository userRepository) {
        this.dietRepository = dietRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Diet> getAllDiets(String username) {
        return dietRepository.findByUserIdOrderByDateDesc(findUser(username).getId());
    }

    @Transactional(readOnly = true)
    public Diet getDiet(Long id, String username) {
        return dietRepository.findById(id)
                .filter(d -> d.getUser().getUsername().equals(username))
                .orElseThrow(() -> new RuntimeException("Dieta no encontrada"));
    }

    @Transactional
    public Diet createDiet(Diet diet, String username) {
        diet.setUser(findUser(username));
        return dietRepository.save(diet);
    }

    @Transactional
    public Diet updateDiet(Long id, Diet updated, String username) {
        Diet diet = getDiet(id, username);
        diet.setName(updated.getName());
        diet.setDate(updated.getDate());
        diet.setBreakfast(updated.getBreakfast());
        diet.setLunch(updated.getLunch());
        diet.setSnack(updated.getSnack());
        diet.setDinner(updated.getDinner());
        diet.setCalories(updated.getCalories());
        if (updated.getMeals() != null) {
            diet.getMeals().clear();
            diet.getMeals().addAll(updated.getMeals());
        }
        return dietRepository.save(diet);
    }

    @Transactional
    public void deleteDiet(Long id, String username) {
        dietRepository.delete(getDiet(id, username));
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
