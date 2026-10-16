package com.eazyplan.config;

import com.eazyplan.model.Diet;
import com.eazyplan.model.Exercise;
import com.eazyplan.model.ShoppingItem;
import com.eazyplan.model.User;
import com.eazyplan.repository.DietRepository;
import com.eazyplan.repository.ExerciseRepository;
import com.eazyplan.repository.ShoppingItemRepository;
import com.eazyplan.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeDatabase(UserRepository userRepository,
                                       DietRepository dietRepository,
                                       ExerciseRepository exerciseRepository,
                                       ShoppingItemRepository shoppingItemRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User demo = new User();
                demo.setUsername("demo");
                demo.setPassword("1234");
                demo.setName("Usuario de Demo");
                demo.setEmail("demo@eazyplan.com");
                demo.setAge(30);
                demo.setWeightKg(70.0);
                demo.setHeightCm(175.0);
                User user = userRepository.save(demo);

                // Dietas de ejemplo
                Diet diet1 = new Diet();
                diet1.setName("Dieta Día 1");
                diet1.setDate(LocalDate.now());
                diet1.setBreakfast("Yogur con avena y frutas");
                diet1.setLunch("Pechuga de pollo arroz integral");
                diet1.setSnack("Un puñado de frutos secos");
                diet1.setDinner("Salmón con verduras al horno");
                diet1.setCalories(1800.0);
                dietRepository.save(diet1);

                Diet diet2 = new Diet();
                diet2.setName("Dieta Día 2");
                diet2.setDate(LocalDate.now().plusDays(1));
                diet2.setBreakfast("Tostadas con aguacate y huevo");
                diet2.setLunch("Ensalada de garbanzos");
                diet2.setSnack("Una fruta");
                diet2.setDinner("Pescado blanco al vapor");
                diet2.setCalories(1750.0);
                dietRepository.save(diet2);

                // Ejercicios de ejemplo
                Exercise exercise1 = new Exercise();
                exercise1.setName("Sentadillas");
                exercise1.setMuscleGroup("Piernas");
                exercise1.setDescription("Sentadillas con peso corporal");
                exercise1.setSets(3);
                exercise1.setReps(15);
                exercise1.setDifficulty("Básico");
                exerciseRepository.save(exercise1);

                Exercise exercise2 = new Exercise();
                exercise2.setName("Press de pecho");
                exercise2.setMuscleGroup("Pecho");
                exercise2.setDescription("Press con barra en banco plano");
                exercise2.setSets(4);
                exercise2.setReps(10);
                exercise2.setDifficulty("Intermedio");
                exerciseRepository.save(exercise2);

                Exercise exercise3 = new Exercise();
                exercise3.setName("Plancha");
                exercise3.setMuscleGroup("Abdomen");
                exercise3.setDescription("Mantener la posición de plancha");
                exercise3.setDurationMinutes(3.0);
                exercise3.setDifficulty("Básico");
                exerciseRepository.save(exercise3);

                // Lista de compra semanal
                LocalDate weekOf = LocalDate.now();
                List<String> items = List.of(
                    "Leche", "Huevos", "Pechuga de pollo", "Salmón",
                    "Arroz integral", "Avena", "Frutas", "Verduras",
                    "Garbanzos", "Frutos secos", "Aguacate", "Tostadas integrales"
                );
                for (String name : items) {
                    ShoppingItem item = new ShoppingItem();
                    item.setName(name);
                    item.setCategory(categoryFor(name));
                    item.setQuantity(1);
                    item.setBought(false);
                    item.setWeekOf(weekOf);
                    item.setUser(user);
                    shoppingItemRepository.save(item);
                }
            }
        };
    }

    private String categoryFor(String name) {
        String n = name.toLowerCase();
        if (n.contains("leche") || n.contains("huevos")) return "Lácteos";
        if (n.contains("pollo") || n.contains("salmón") || n.contains("salmon") || n.contains("pescado")) return "Carnes y pescados";
        if (n.contains("arroz") || n.contains("avena") || n.contains("tostadas") || n.contains("garbanzos")) return "Despensa";
        if (n.contains("fruta") || n.contains("verdura") || n.contains("aguacate")) return "Frutas y verduras";
        if (n.contains("frutos secos")) return "Despensa";
        return "Otros";
    }
}
