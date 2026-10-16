package com.eazyplan.repository;

import com.eazyplan.model.ShoppingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {
    List<ShoppingItem> findByUserIdOrderByCategory(Long userId);
    List<ShoppingItem> findByWeekOf(LocalDate weekOf);
}
