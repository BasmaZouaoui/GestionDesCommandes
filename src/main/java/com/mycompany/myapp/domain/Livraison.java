package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A Livraison.
 */
@Entity
@Table(name = "livraison")
public class Livraison implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "numerolivraison")
    private Integer numerolivraison;

    @Column(name = "datelivraison")
    private Instant datelivraison;

    @ManyToOne
    @JsonIgnoreProperties(value = { "client", "factures", "livraisons", "produits" }, allowSetters = true)
    private Commande commande;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Livraison id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumerolivraison() {
        return this.numerolivraison;
    }

    public Livraison numerolivraison(Integer numerolivraison) {
        this.setNumerolivraison(numerolivraison);
        return this;
    }

    public void setNumerolivraison(Integer numerolivraison) {
        this.numerolivraison = numerolivraison;
    }

    public Instant getDatelivraison() {
        return this.datelivraison;
    }

    public Livraison datelivraison(Instant datelivraison) {
        this.setDatelivraison(datelivraison);
        return this;
    }

    public void setDatelivraison(Instant datelivraison) {
        this.datelivraison = datelivraison;
    }

    public Commande getCommande() {
        return this.commande;
    }

    public void setCommande(Commande commande) {
        this.commande = commande;
    }

    public Livraison commande(Commande commande) {
        this.setCommande(commande);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Livraison)) {
            return false;
        }
        return id != null && id.equals(((Livraison) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Livraison{" +
            "id=" + getId() +
            ", numerolivraison=" + getNumerolivraison() +
            ", datelivraison='" + getDatelivraison() + "'" +
            "}";
    }
}
