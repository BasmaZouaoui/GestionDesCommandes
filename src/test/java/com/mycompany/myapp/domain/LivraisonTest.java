package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LivraisonTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Livraison.class);
        Livraison livraison1 = new Livraison();
        livraison1.setId(1L);
        Livraison livraison2 = new Livraison();
        livraison2.setId(livraison1.getId());
        assertThat(livraison1).isEqualTo(livraison2);
        livraison2.setId(2L);
        assertThat(livraison1).isNotEqualTo(livraison2);
        livraison1.setId(null);
        assertThat(livraison1).isNotEqualTo(livraison2);
    }
}
