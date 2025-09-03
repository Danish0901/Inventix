package com.danish.Inventixx.repositories;

import com.danish.Inventixx.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    
}
