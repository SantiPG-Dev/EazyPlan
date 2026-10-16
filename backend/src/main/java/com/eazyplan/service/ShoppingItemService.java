package com.eazyplan.service;

import com.eazyplan.model.ShoppingItem;
import com.eazyplan.model.User;
import com.eazyplan.repository.ShoppingItemRepository;
import com.eazyplan.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShoppingItemService {

    private final ShoppingItemRepository shoppingItemRepository;
    private final UserRepository userRepository;

    public ShoppingItemService(ShoppingItemRepository shoppingItemRepository, UserRepository userRepository) {
        this.shoppingItemRepository = shoppingItemRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ShoppingItem> getAllItems(String username) {
        return shoppingItemRepository.findByUserIdOrderByCategory(findUser(username).getId());
    }

    @Transactional(readOnly = true)
    public ShoppingItem getItem(Long id, String username) {
        return shoppingItemRepository.findById(id)
                .filter(i -> i.getUser().getUsername().equals(username))
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Transactional
    public ShoppingItem createItem(ShoppingItem item, String username) {
        item.setUser(findUser(username));
        return shoppingItemRepository.save(item);
    }

    @Transactional
    public ShoppingItem updateItem(Long id, ShoppingItem updated, String username) {
        ShoppingItem item = getItem(id, username);
        item.setName(updated.getName());
        item.setCategory(updated.getCategory());
        item.setQuantity(updated.getQuantity());
        item.setBought(updated.getBought());
        return shoppingItemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Long id, String username) {
        shoppingItemRepository.delete(getItem(id, username));
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
