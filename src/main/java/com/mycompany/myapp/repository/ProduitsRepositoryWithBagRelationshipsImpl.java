package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Produits;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ProduitsRepositoryWithBagRelationshipsImpl implements ProduitsRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Produits> fetchBagRelationships(Optional<Produits> produits) {
        return produits.map(this::fetchCommandes);
    }

    @Override
    public Page<Produits> fetchBagRelationships(Page<Produits> produits) {
        return new PageImpl<>(fetchBagRelationships(produits.getContent()), produits.getPageable(), produits.getTotalElements());
    }

    @Override
    public List<Produits> fetchBagRelationships(List<Produits> produits) {
        return Optional.of(produits).map(this::fetchCommandes).orElse(Collections.emptyList());
    }

    Produits fetchCommandes(Produits result) {
        return entityManager
            .createQuery(
                "select produits from Produits produits left join fetch produits.commandes where produits is :produits",
                Produits.class
            )
            .setParameter("produits", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Produits> fetchCommandes(List<Produits> produits) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, produits.size()).forEach(index -> order.put(produits.get(index).getId(), index));
        List<Produits> result = entityManager
            .createQuery(
                "select distinct produits from Produits produits left join fetch produits.commandes where produits in :produits",
                Produits.class
            )
            .setParameter("produits", produits)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
