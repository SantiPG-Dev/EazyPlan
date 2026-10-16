package com.eazyplan.service;

import com.eazyplan.dto.LoginRequest;
import com.eazyplan.dto.RegisterRequest;
import com.eazyplan.model.User;
import com.eazyplan.repository.UserRepository;
import com.eazyplan.security.JwtService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalStateException("El usuario ya existe");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        // En producción: hash con BCrypt. Aquí se almacena en texto plano para simplificar el demo.
        user.setPassword(request.getPassword());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setAge(request.getAge());
        user.setWeightKg(request.getWeightKg());
        user.setHeightCm(request.getHeightCm());
        return userRepository.save(user);
    }

    public String authenticate(LoginRequest request) {
        Optional<User> user = userRepository.findByUsername(request.getUsername());
        if (user.isEmpty() || !user.get().getPassword().equals(request.getPassword())) {
            throw new IllegalStateException("Usuario o contraseña incorrectos");
        }
        return jwtService.generateToken(user.get().getUsername());
    }

    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
