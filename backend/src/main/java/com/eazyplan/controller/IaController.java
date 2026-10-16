package com.eazyplan.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.Map;

@RestController
@RequestMapping("/ia")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class IaController {

    @Value("${ai.api-key:}")
    private String apiKey;

    @Value("${ai.base-url:https://api.openai.com/v1}")
    private String baseUrl;

    @Value("${ai.model:gpt-4o-mini}")
    private String model;

    @PostMapping(value = "/chat", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> chat(@RequestBody Map<String, String> request) {
        String prompt = request.getOrDefault("message", "");
        if (prompt.isBlank()) {
            return Map.of("error", "El mensaje no puede estar vacío");
        }

        // Fallback local si no hay API key configurada
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("sk-change-me")) {
            String response = buildLocalResponse(prompt);
            return Map.of(
                "response", response,
                "provider", "local"
            );
        }

        try {
            RestClient client = RestClient.builder().baseUrl(baseUrl).build();
            Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", java.util.List.of(
                    Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.7
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> response = client.post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

            @SuppressWarnings("unchecked")
            var choices = (java.util.List<?>) response.get("choices");
            String content = "";
            if (choices != null && !choices.isEmpty()) {
                content = ((Map<String, Object>) choices.get(0)).get("text").toString();
            }
            return Map.of("response", content, "provider", "openai");
        } catch (Exception e) {
            return Map.of(
                "response", "Lo siento, no he podido conectar con el servicio de IA: " + e.getMessage(),
                "provider", "error"
            );
        }
    }

    private String buildLocalResponse(String prompt) {
        String p = prompt.toLowerCase();
        if (p.contains("dieta") || p.contains("comer") || p.contains("aliment")) {
            return "Para una dieta equilibrada, te recomiendo incluir proteínas magras, verduras de color, " +
                   "carbohidratos complejos y grasas saludables. Intenta repartir las comidas en 4-5 tomas al día " +
                   "y mantenerse bien hidratado. ¿Quieres que diseñe una dieta para un día concreto?";
        }
        if (p.contains("ejercicio") || p.contains("entrenam") || p.contains("deporte") || p.contains("fitness")) {
            return "Para mejorar tu forma física, combina ejercicio aeróbico (caminar, correr, nadar) con " +
                   "entrenamiento de fuerza 3-4 veces por semana. Empieza con series cortas e incrementa la intensidad gradualmente.";
        }
        if (p.contains("peso") || p.contains("engord") || p.contains("bajar") || p.contains("dieta")) {
            return "Para controlar el peso, lo más efectivo es mantener un ligero déficit calórico combinado con " +
                   "actividad física regular. Evita los alimentos ultraprocesados y controla las porciones.";
        }
        if (p.contains("hola") || p.contains("buenos") || p.contains("buenas")) {
            return "¡Hola! Soy el asistente de EazyPlan. Puedo ayudarte con planes de dieta, ejercicios y la lista de compra.";
        }
        return "Gracias por tu pregunta. Como asistente en modo demo, puedo orientarte sobre dietas, ejercicio físico " +
               "y organización de la lista de compra. Para respuestas más avanzadas, configura una API key en el backend.";
    }
}
