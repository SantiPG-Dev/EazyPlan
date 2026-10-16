package com.eazyplan.controller;

import com.eazyplan.model.Diet;
import com.eazyplan.service.DietService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/diets")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class DietController {

    private final DietService dietService;

    public DietController(DietService dietService) {
        this.dietService = dietService;
    }

    @GetMapping
    public List<Diet> list(@RequestHeader("Authorization") String auth) {
        return dietService.getAllDiets(extractUsername(auth));
    }

    @GetMapping("/{id}")
    public Diet get(@PathVariable Long id, @RequestHeader("Authorization") String auth) {
        return dietService.getDiet(id, extractUsername(auth));
    }

    @PostMapping
    public Diet create(@Valid @RequestBody Diet diet, @RequestHeader("Authorization") String auth) {
        return dietService.createDiet(diet, extractUsername(auth));
    }

    @PutMapping("/{id}")
    public Diet update(@PathVariable Long id, @Valid @RequestBody Diet diet,
                       @RequestHeader("Authorization") String auth) {
        return dietService.updateDiet(id, diet, extractUsername(auth));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestHeader("Authorization") String auth) {
        dietService.deleteDiet(id, extractUsername(auth));
        return ResponseEntity.noContent().build();
    }

    private String extractUsername(String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new RuntimeException("Token no proporcionado");
        }
        return auth.substring(7);
    }
}
