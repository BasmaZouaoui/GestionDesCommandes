package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Produits;
import com.mycompany.myapp.repository.ProduitsRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProduitsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProduitsResourceIT {

    private static final Integer DEFAULT_NUMEROPRODUIT = 1;
    private static final Integer UPDATED_NUMEROPRODUIT = 2;

    private static final String DEFAULT_NOMPRODUIT = "AAAAAAAAAA";
    private static final String UPDATED_NOMPRODUIT = "BBBBBBBBBB";

    private static final Integer DEFAULT_QUANTITE = 1;
    private static final Integer UPDATED_QUANTITE = 2;

    private static final Double DEFAULT_PRIX = 1D;
    private static final Double UPDATED_PRIX = 2D;

    private static final String ENTITY_API_URL = "/api/produits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProduitsRepository produitsRepository;

    @Mock
    private ProduitsRepository produitsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProduitsMockMvc;

    private Produits produits;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Produits createEntity(EntityManager em) {
        Produits produits = new Produits()
            .numeroproduit(DEFAULT_NUMEROPRODUIT)
            .nomproduit(DEFAULT_NOMPRODUIT)
            .quantite(DEFAULT_QUANTITE)
            .prix(DEFAULT_PRIX);
        return produits;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Produits createUpdatedEntity(EntityManager em) {
        Produits produits = new Produits()
            .numeroproduit(UPDATED_NUMEROPRODUIT)
            .nomproduit(UPDATED_NOMPRODUIT)
            .quantite(UPDATED_QUANTITE)
            .prix(UPDATED_PRIX);
        return produits;
    }

    @BeforeEach
    public void initTest() {
        produits = createEntity(em);
    }

    @Test
    @Transactional
    void createProduits() throws Exception {
        int databaseSizeBeforeCreate = produitsRepository.findAll().size();
        // Create the Produits
        restProduitsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produits)))
            .andExpect(status().isCreated());

        // Validate the Produits in the database
        List<Produits> produitsList = produitsRepository.findAll();
        assertThat(produitsList).hasSize(databaseSizeBeforeCreate + 1);
        Produits testProduits = produitsList.get(produitsList.size() - 1);
        assertThat(testProduits.getNumeroproduit()).isEqualTo(DEFAULT_NUMEROPRODUIT);
        assertThat(testProduits.getNomproduit()).isEqualTo(DEFAULT_NOMPRODUIT);
        assertThat(testProduits.getQuantite()).isEqualTo(DEFAULT_QUANTITE);
        assertThat(testProduits.getPrix()).isEqualTo(DEFAULT_PRIX);
    }

    @Test
    @Transactional
    void createProduitsWithExistingId() throws Exception {
        // Create the Produits with an existing ID
        produits.setId(1L);

        int databaseSizeBeforeCreate = produitsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProduitsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produits)))
            .andExpect(status().isBadRequest());

        // Validate the Produits in the database
        List<Produits> produitsList = produitsRepository.findAll();
        assertThat(produitsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProduits() throws Exception {
        // Initialize the database
        produitsRepository.saveAndFlush(produits);

        // Get all the produitsList
        restProduitsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(produits.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroproduit").value(hasItem(DEFAULT_NUMEROPRODUIT)))
            .andExpect(jsonPath("$.[*].nomproduit").value(hasItem(DEFAULT_NOMPRODUIT)))
            .andExpect(jsonPath("$.[*].quantite").value(hasItem(DEFAULT_QUANTITE)))
            .andExpect(jsonPath("$.[*].prix").value(hasItem(DEFAULT_PRIX.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProduitsWithEagerRelationshipsIsEnabled() throws Exception {
        when(produitsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProduitsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(produitsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProduitsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(produitsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProduitsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(produitsRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getProduits() throws Exception {
        // Initialize the database
        produitsRepository.saveAndFlush(produits);

        // Get the produits
        restProduitsMockMvc
            .perform(get(ENTITY_API_URL_ID, produits.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(produits.getId().intValue()))
            .andExpect(jsonPath("$.numeroproduit").value(DEFAULT_NUMEROPRODUIT))
            .andExpect(jsonPath("$.nomproduit").value(DEFAULT_NOMPRODUIT))
            .andExpect(jsonPath("$.quantite").value(DEFAULT_QUANTITE))
            .andExpect(jsonPath("$.prix").value(DEFAULT_PRIX.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingProduits() throws Exception {
        // Get the produits
        restProduitsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProduits() throws Exception {
        // Initialize the database
        produitsRepository.saveAndFlush(produits);

        int databaseSizeBeforeUpdate = produitsRepository.findAll().size();

        // Update the produits
        Produits updatedProduits = produitsRepository.findById(produits.getId()).get();
        // Disconnect from session so that the updates on updatedProduits are not directly saved in db
        em.detach(updatedProduits);
        updatedProduits.numeroproduit(UPDATED_NUMEROPRODUIT).nomproduit(UPDATED_NOMPRODUIT).quantite(UPDATED_QUANTITE).prix(UPDATED_PRIX);

        restProduitsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProduits.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProduits))
            )
            .andExpect(status().isOk());

        // Validate the Produits in the database
        List<Produits> produitsList = produitsRepository.findAll();
        assertThat(produitsList).hasSize(databaseSizeBeforeUpdate);
        Produits testProduits = produitsList.get(produitsList.size() - 1);
        assertThat(testProduits.getNumeroproduit()).isEqualTo(UPDATED_NUMEROPRODUIT);
        assertThat(testProduits.getNomproduit()).isEqualTo(UPDATED_NOMPRODUIT);
        assertThat(testProduits.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testProduits.getPrix()).isEqualTo(UPDATED_PRIX);
    }

    @Test
    @Transactional
    void putNonExistingProduits() throws Exception {
        int databaseSizeBeforeUpdate = produitsRepository.findAll().size();
        produits.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProduitsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, produits.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(produits))
            )
            .andExpect(status().isBadRequest());

        // Validate the Produits in the database
        List<Produits> produitsList = produitsRepository.findAll();
        assertThat(produitsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProduits() throws Exception {
        int databaseSizeBeforeUpdate = produitsRepository.findAll().size();
        produits.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProduitsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(produits))
            )
            .andExpect(status().isBadRequest());

        // Validate the Produits in the database
        List<Produits> produitsList = produitsRepository.findAll();
        assertThat(produitsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProduits() throws Exception {
        int databaseSizeBeforeUpdate = produitsRepository.findAll().size();
        produits.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProduitsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produits)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Produits in the database
        List<Produits> produitsList = produitsRepository.findAll();
        assertThat(produitsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProduitsWithPatch() throws Exception {
        // Initialize the database
        produitsRepository.saveAndFlush(produits);

        int databaseSizeBeforeUpdate = produitsRepository.findAll().size();

        // Update the produits using partial update
        Produits partialUpdatedProduits = new Produits();
        partialUpdatedProduits.setId(produits.getId());

        partialUpdatedProduits.numeroproduit(UPDATED_NUMEROPRODUIT).quantite(UPDATED_QUANTITE).prix(UPDATED_PRIX);

        restProduitsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProduits.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProduits))
            )
            .andExpect(status().isOk());

        // Validate the Produits in the database
        List<Produits> produitsList = produitsRepository.findAll();
        assertThat(produitsList).hasSize(databaseSizeBeforeUpdate);
        Produits testProduits = produitsList.get(produitsList.size() - 1);
        assertThat(testProduits.getNumeroproduit()).isEqualTo(UPDATED_NUMEROPRODUIT);
        assertThat(testProduits.getNomproduit()).isEqualTo(DEFAULT_NOMPRODUIT);
        assertThat(testProduits.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testProduits.getPrix()).isEqualTo(UPDATED_PRIX);
    }

    @Test
    @Transactional
    void fullUpdateProduitsWithPatch() throws Exception {
        // Initialize the database
        produitsRepository.saveAndFlush(produits);

        int databaseSizeBeforeUpdate = produitsRepository.findAll().size();

        // Update the produits using partial update
        Produits partialUpdatedProduits = new Produits();
        partialUpdatedProduits.setId(produits.getId());

        partialUpdatedProduits
            .numeroproduit(UPDATED_NUMEROPRODUIT)
            .nomproduit(UPDATED_NOMPRODUIT)
            .quantite(UPDATED_QUANTITE)
            .prix(UPDATED_PRIX);

        restProduitsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProduits.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProduits))
            )
            .andExpect(status().isOk());

        // Validate the Produits in the database
        List<Produits> produitsList = produitsRepository.findAll();
        assertThat(produitsList).hasSize(databaseSizeBeforeUpdate);
        Produits testProduits = produitsList.get(produitsList.size() - 1);
        assertThat(testProduits.getNumeroproduit()).isEqualTo(UPDATED_NUMEROPRODUIT);
        assertThat(testProduits.getNomproduit()).isEqualTo(UPDATED_NOMPRODUIT);
        assertThat(testProduits.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testProduits.getPrix()).isEqualTo(UPDATED_PRIX);
    }

    @Test
    @Transactional
    void patchNonExistingProduits() throws Exception {
        int databaseSizeBeforeUpdate = produitsRepository.findAll().size();
        produits.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProduitsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, produits.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produits))
            )
            .andExpect(status().isBadRequest());

        // Validate the Produits in the database
        List<Produits> produitsList = produitsRepository.findAll();
        assertThat(produitsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProduits() throws Exception {
        int databaseSizeBeforeUpdate = produitsRepository.findAll().size();
        produits.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProduitsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produits))
            )
            .andExpect(status().isBadRequest());

        // Validate the Produits in the database
        List<Produits> produitsList = produitsRepository.findAll();
        assertThat(produitsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProduits() throws Exception {
        int databaseSizeBeforeUpdate = produitsRepository.findAll().size();
        produits.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProduitsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(produits)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Produits in the database
        List<Produits> produitsList = produitsRepository.findAll();
        assertThat(produitsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProduits() throws Exception {
        // Initialize the database
        produitsRepository.saveAndFlush(produits);

        int databaseSizeBeforeDelete = produitsRepository.findAll().size();

        // Delete the produits
        restProduitsMockMvc
            .perform(delete(ENTITY_API_URL_ID, produits.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Produits> produitsList = produitsRepository.findAll();
        assertThat(produitsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
