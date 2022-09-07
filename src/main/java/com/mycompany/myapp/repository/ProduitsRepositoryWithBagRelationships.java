package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Produits;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface ProduitsRepositoryWithBagRelationships {
    Optional<Produits> fetchBagRelationships(Optional<Produits> produits);

    List<Produits> fetchBagRelationships(List<Produits> produits);

    Page<Produits> fetchBagRelationships(Page<Produits> produits);
}
