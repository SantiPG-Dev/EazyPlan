package com.eazyplan.controller;

import com.eazyplan.model.ShoppingItem;
import com.eazyplan.service.ShoppingItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shopping")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class ShoppingItemController {

    private final ShoppingItemService shoppingItemService;

    public ShoppingItemController(ShoppingItemService shoppingItemService) {
        this.shoppingItemService = shoppingItemService;
    }

    @GetMapping
    public List<ShoppingItem> list(@RequestHeader("Authorization") String auth) {
        return shoppingItemService.getAllItems(extractUsername(auth));
    }

    @PostMapping
    public ShoppingItem create(@Valid @RequestBody ShoppingItem item, @RequestHeader("Authorization") String auth) {
        return shoppingItemService.createItem(item, extractUsername(auth));
    }

    @PutMapping("/{id}")
    public ShoppingItem update(@PathVariable Long id, @Valid @RequestBody ShoppingItem item,
                               @RequestHeader("Authorization") String auth) {
        return shoppingItemService.updateItem(id, item, extractUsername(auth));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestHeader("Authorization") String auth) {
        shoppingItemService.deleteItem(id, extractUsername(auth));
        return ResponseEntity.noContent().build();
    }

    private String extractUsername(String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new RuntimeException("Token no proporcionado");
        }
        return auth.substring(7);
    }
}
