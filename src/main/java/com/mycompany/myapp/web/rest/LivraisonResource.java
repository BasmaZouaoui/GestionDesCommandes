package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Livraison;
import com.mycompany.myapp.repository.LivraisonRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Livraison}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LivraisonResource {

    private final Logger log = LoggerFactory.getLogger(LivraisonResource.class);

    private static final String ENTITY_NAME = "livraison";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LivraisonRepository livraisonRepository;

    public LivraisonResource(LivraisonRepository livraisonRepository) {
        this.livraisonRepository = livraisonRepository;
    }

    /**
     * {@code POST  /livraisons} : Create a new livraison.
     *
     * @param livraison the livraison to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new livraison, or with status {@code 400 (Bad Request)} if the livraison has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/livraisons")
    public ResponseEntity<Livraison> createLivraison(@RequestBody Livraison livraison) throws URISyntaxException {
        log.debug("REST request to save Livraison : {}", livraison);
        if (livraison.getId() != null) {
            throw new BadRequestAlertException("A new livraison cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Livraison result = livraisonRepository.save(livraison);
        return ResponseEntity
            .created(new URI("/api/livraisons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /livraisons/:id} : Updates an existing livraison.
     *
     * @param id the id of the livraison to save.
     * @param livraison the livraison to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated livraison,
     * or with status {@code 400 (Bad Request)} if the livraison is not valid,
     * or with status {@code 500 (Internal Server Error)} if the livraison couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/livraisons/{id}")
    public ResponseEntity<Livraison> updateLivraison(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Livraison livraison
    ) throws URISyntaxException {
        log.debug("REST request to update Livraison : {}, {}", id, livraison);
        if (livraison.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, livraison.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!livraisonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Livraison result = livraisonRepository.save(livraison);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, livraison.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /livraisons/:id} : Partial updates given fields of an existing livraison, field will ignore if it is null
     *
     * @param id the id of the livraison to save.
     * @param livraison the livraison to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated livraison,
     * or with status {@code 400 (Bad Request)} if the livraison is not valid,
     * or with status {@code 404 (Not Found)} if the livraison is not found,
     * or with status {@code 500 (Internal Server Error)} if the livraison couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/livraisons/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Livraison> partialUpdateLivraison(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Livraison livraison
    ) throws URISyntaxException {
        log.debug("REST request to partial update Livraison partially : {}, {}", id, livraison);
        if (livraison.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, livraison.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!livraisonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Livraison> result = livraisonRepository
            .findById(livraison.getId())
            .map(existingLivraison -> {
                if (livraison.getNumerolivraison() != null) {
                    existingLivraison.setNumerolivraison(livraison.getNumerolivraison());
                }
                if (livraison.getDatelivraison() != null) {
                    existingLivraison.setDatelivraison(livraison.getDatelivraison());
                }

                return existingLivraison;
            })
            .map(livraisonRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, livraison.getId().toString())
        );
    }

    /**
     * {@code GET  /livraisons} : get all the livraisons.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of livraisons in body.
     */
    @GetMapping("/livraisons")
    public List<Livraison> getAllLivraisons(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Livraisons");
        if (eagerload) {
            return livraisonRepository.findAllWithEagerRelationships();
        } else {
            return livraisonRepository.findAll();
        }
    }

    /**
     * {@code GET  /livraisons/:id} : get the "id" livraison.
     *
     * @param id the id of the livraison to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the livraison, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/livraisons/{id}")
    public ResponseEntity<Livraison> getLivraison(@PathVariable Long id) {
        log.debug("REST request to get Livraison : {}", id);
        Optional<Livraison> livraison = livraisonRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(livraison);
    }

    /**
     * {@code DELETE  /livraisons/:id} : delete the "id" livraison.
     *
     * @param id the id of the livraison to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/livraisons/{id}")
    public ResponseEntity<Void> deleteLivraison(@PathVariable Long id) {
        log.debug("REST request to delete Livraison : {}", id);
        livraisonRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
