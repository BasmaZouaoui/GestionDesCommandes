package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Commande;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Commande entity.
 */
@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    default Optional<Commande> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Commande> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Commande> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct commande from Commande commande left join fetch commande.client",
        countQuery = "select count(distinct commande) from Commande commande"
    )
    Page<Commande> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct commande from Commande commande left join fetch commande.client")
    List<Commande> findAllWithToOneRelationships();

    @Query("select commande from Commande commande left join fetch commande.client where commande.id =:id")
    Optional<Commande> findOneWithToOneRelationships(@Param("id") Long id);
}
