package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Livraison;
import com.mycompany.myapp.repository.LivraisonRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link LivraisonResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class LivraisonResourceIT {

    private static final Integer DEFAULT_NUMEROLIVRAISON = 1;
    private static final Integer UPDATED_NUMEROLIVRAISON = 2;

    private static final Instant DEFAULT_DATELIVRAISON = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATELIVRAISON = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/livraisons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LivraisonRepository livraisonRepository;

    @Mock
    private LivraisonRepository livraisonRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLivraisonMockMvc;

    private Livraison livraison;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Livraison createEntity(EntityManager em) {
        Livraison livraison = new Livraison().numerolivraison(DEFAULT_NUMEROLIVRAISON).datelivraison(DEFAULT_DATELIVRAISON);
        return livraison;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Livraison createUpdatedEntity(EntityManager em) {
        Livraison livraison = new Livraison().numerolivraison(UPDATED_NUMEROLIVRAISON).datelivraison(UPDATED_DATELIVRAISON);
        return livraison;
    }

    @BeforeEach
    public void initTest() {
        livraison = createEntity(em);
    }

    @Test
    @Transactional
    void createLivraison() throws Exception {
        int databaseSizeBeforeCreate = livraisonRepository.findAll().size();
        // Create the Livraison
        restLivraisonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(livraison)))
            .andExpect(status().isCreated());

        // Validate the Livraison in the database
        List<Livraison> livraisonList = livraisonRepository.findAll();
        assertThat(livraisonList).hasSize(databaseSizeBeforeCreate + 1);
        Livraison testLivraison = livraisonList.get(livraisonList.size() - 1);
        assertThat(testLivraison.getNumerolivraison()).isEqualTo(DEFAULT_NUMEROLIVRAISON);
        assertThat(testLivraison.getDatelivraison()).isEqualTo(DEFAULT_DATELIVRAISON);
    }

    @Test
    @Transactional
    void createLivraisonWithExistingId() throws Exception {
        // Create the Livraison with an existing ID
        livraison.setId(1L);

        int databaseSizeBeforeCreate = livraisonRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLivraisonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(livraison)))
            .andExpect(status().isBadRequest());

        // Validate the Livraison in the database
        List<Livraison> livraisonList = livraisonRepository.findAll();
        assertThat(livraisonList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLivraisons() throws Exception {
        // Initialize the database
        livraisonRepository.saveAndFlush(livraison);

        // Get all the livraisonList
        restLivraisonMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(livraison.getId().intValue())))
            .andExpect(jsonPath("$.[*].numerolivraison").value(hasItem(DEFAULT_NUMEROLIVRAISON)))
            .andExpect(jsonPath("$.[*].datelivraison").value(hasItem(DEFAULT_DATELIVRAISON.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLivraisonsWithEagerRelationshipsIsEnabled() throws Exception {
        when(livraisonRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLivraisonMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(livraisonRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLivraisonsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(livraisonRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLivraisonMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(livraisonRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getLivraison() throws Exception {
        // Initialize the database
        livraisonRepository.saveAndFlush(livraison);

        // Get the livraison
        restLivraisonMockMvc
            .perform(get(ENTITY_API_URL_ID, livraison.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(livraison.getId().intValue()))
            .andExpect(jsonPath("$.numerolivraison").value(DEFAULT_NUMEROLIVRAISON))
            .andExpect(jsonPath("$.datelivraison").value(DEFAULT_DATELIVRAISON.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLivraison() throws Exception {
        // Get the livraison
        restLivraisonMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLivraison() throws Exception {
        // Initialize the database
        livraisonRepository.saveAndFlush(livraison);

        int databaseSizeBeforeUpdate = livraisonRepository.findAll().size();

        // Update the livraison
        Livraison updatedLivraison = livraisonRepository.findById(livraison.getId()).get();
        // Disconnect from session so that the updates on updatedLivraison are not directly saved in db
        em.detach(updatedLivraison);
        updatedLivraison.numerolivraison(UPDATED_NUMEROLIVRAISON).datelivraison(UPDATED_DATELIVRAISON);

        restLivraisonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLivraison.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLivraison))
            )
            .andExpect(status().isOk());

        // Validate the Livraison in the database
        List<Livraison> livraisonList = livraisonRepository.findAll();
        assertThat(livraisonList).hasSize(databaseSizeBeforeUpdate);
        Livraison testLivraison = livraisonList.get(livraisonList.size() - 1);
        assertThat(testLivraison.getNumerolivraison()).isEqualTo(UPDATED_NUMEROLIVRAISON);
        assertThat(testLivraison.getDatelivraison()).isEqualTo(UPDATED_DATELIVRAISON);
    }

    @Test
    @Transactional
    void putNonExistingLivraison() throws Exception {
        int databaseSizeBeforeUpdate = livraisonRepository.findAll().size();
        livraison.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLivraisonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, livraison.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(livraison))
            )
            .andExpect(status().isBadRequest());

        // Validate the Livraison in the database
        List<Livraison> livraisonList = livraisonRepository.findAll();
        assertThat(livraisonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLivraison() throws Exception {
        int databaseSizeBeforeUpdate = livraisonRepository.findAll().size();
        livraison.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLivraisonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(livraison))
            )
            .andExpect(status().isBadRequest());

        // Validate the Livraison in the database
        List<Livraison> livraisonList = livraisonRepository.findAll();
        assertThat(livraisonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLivraison() throws Exception {
        int databaseSizeBeforeUpdate = livraisonRepository.findAll().size();
        livraison.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLivraisonMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(livraison)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Livraison in the database
        List<Livraison> livraisonList = livraisonRepository.findAll();
        assertThat(livraisonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLivraisonWithPatch() throws Exception {
        // Initialize the database
        livraisonRepository.saveAndFlush(livraison);

        int databaseSizeBeforeUpdate = livraisonRepository.findAll().size();

        // Update the livraison using partial update
        Livraison partialUpdatedLivraison = new Livraison();
        partialUpdatedLivraison.setId(livraison.getId());

        restLivraisonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLivraison.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLivraison))
            )
            .andExpect(status().isOk());

        // Validate the Livraison in the database
        List<Livraison> livraisonList = livraisonRepository.findAll();
        assertThat(livraisonList).hasSize(databaseSizeBeforeUpdate);
        Livraison testLivraison = livraisonList.get(livraisonList.size() - 1);
        assertThat(testLivraison.getNumerolivraison()).isEqualTo(DEFAULT_NUMEROLIVRAISON);
        assertThat(testLivraison.getDatelivraison()).isEqualTo(DEFAULT_DATELIVRAISON);
    }

    @Test
    @Transactional
    void fullUpdateLivraisonWithPatch() throws Exception {
        // Initialize the database
        livraisonRepository.saveAndFlush(livraison);

        int databaseSizeBeforeUpdate = livraisonRepository.findAll().size();

        // Update the livraison using partial update
        Livraison partialUpdatedLivraison = new Livraison();
        partialUpdatedLivraison.setId(livraison.getId());

        partialUpdatedLivraison.numerolivraison(UPDATED_NUMEROLIVRAISON).datelivraison(UPDATED_DATELIVRAISON);

        restLivraisonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLivraison.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLivraison))
            )
            .andExpect(status().isOk());

        // Validate the Livraison in the database
        List<Livraison> livraisonList = livraisonRepository.findAll();
        assertThat(livraisonList).hasSize(databaseSizeBeforeUpdate);
        Livraison testLivraison = livraisonList.get(livraisonList.size() - 1);
        assertThat(testLivraison.getNumerolivraison()).isEqualTo(UPDATED_NUMEROLIVRAISON);
        assertThat(testLivraison.getDatelivraison()).isEqualTo(UPDATED_DATELIVRAISON);
    }

    @Test
    @Transactional
    void patchNonExistingLivraison() throws Exception {
        int databaseSizeBeforeUpdate = livraisonRepository.findAll().size();
        livraison.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLivraisonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, livraison.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(livraison))
            )
            .andExpect(status().isBadRequest());

        // Validate the Livraison in the database
        List<Livraison> livraisonList = livraisonRepository.findAll();
        assertThat(livraisonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLivraison() throws Exception {
        int databaseSizeBeforeUpdate = livraisonRepository.findAll().size();
        livraison.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLivraisonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(livraison))
            )
            .andExpect(status().isBadRequest());

        // Validate the Livraison in the database
        List<Livraison> livraisonList = livraisonRepository.findAll();
        assertThat(livraisonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLivraison() throws Exception {
        int databaseSizeBeforeUpdate = livraisonRepository.findAll().size();
        livraison.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLivraisonMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(livraison))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Livraison in the database
        List<Livraison> livraisonList = livraisonRepository.findAll();
        assertThat(livraisonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLivraison() throws Exception {
        // Initialize the database
        livraisonRepository.saveAndFlush(livraison);

        int databaseSizeBeforeDelete = livraisonRepository.findAll().size();

        // Delete the livraison
        restLivraisonMockMvc
            .perform(delete(ENTITY_API_URL_ID, livraison.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Livraison> livraisonList = livraisonRepository.findAll();
        assertThat(livraisonList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
