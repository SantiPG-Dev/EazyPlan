package com.eazyplan.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "diets")
public class Diet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "target_date")
    private LocalDate date;

    @Column(name = "breakfast")
    private String breakfast;

    @Column(name = "lunch")
    private String lunch;

    @Column(name = "snack")
    private String snack;

    @Column(name = "dinner")
    private String dinner;

    private Double calories;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ElementCollection
    @CollectionTable(name = "diet_meals", joinColumns = @JoinColumn(name = "diet_id"))
    @Column(name = "meal")
    private List<String> meals = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getBreakfast() { return breakfast; }
    public void setBreakfast(String breakfast) { this.breakfast = breakfast; }

    public String getLunch() { return lunch; }
    public void setLunch(String lunch) { this.lunch = lunch; }

    public String getSnack() { return snack; }
    public void setSnack(String snack) { this.snack = snack; }

    public String getDinner() { return dinner; }
    public void setDinner(String dinner) { this.dinner = dinner; }

    public Double getCalories() { return calories; }
    public void setCalories(Double calories) { this.calories = calories; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<String> getMeals() { return meals; }
    public void setMeals(List<String> meals) { this.meals = meals; }
}
