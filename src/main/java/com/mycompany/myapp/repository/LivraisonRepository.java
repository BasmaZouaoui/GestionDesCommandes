package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Livraison;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Livraison entity.
 */
@Repository
public interface LivraisonRepository extends JpaRepository<Livraison, Long> {
    default Optional<Livraison> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Livraison> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Livraison> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct livraison from Livraison livraison left join fetch livraison.commande",
        countQuery = "select count(distinct livraison) from Livraison livraison"
    )
    Page<Livraison> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct livraison from Livraison livraison left join fetch livraison.commande")
    List<Livraison> findAllWithToOneRelationships();

    @Query("select livraison from Livraison livraison left join fetch livraison.commande where livraison.id =:id")
    Optional<Livraison> findOneWithToOneRelationships(@Param("id") Long id);
}
