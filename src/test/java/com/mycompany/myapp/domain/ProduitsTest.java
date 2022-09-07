package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProduitsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Produits.class);
        Produits produits1 = new Produits();
        produits1.setId(1L);
        Produits produits2 = new Produits();
        produits2.setId(produits1.getId());
        assertThat(produits1).isEqualTo(produits2);
        produits2.setId(2L);
        assertThat(produits1).isNotEqualTo(produits2);
        produits1.setId(null);
        assertThat(produits1).isNotEqualTo(produits2);
    }
}
