package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A Facture.
 */
@Entity
@Table(name = "facture")
public class Facture implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "numerofacture")
    private Integer numerofacture;

    @Column(name = "datefacture")
    private Instant datefacture;

    @Column(name = "montant")
    private Double montant;

    @ManyToOne
    @JsonIgnoreProperties(value = { "client", "factures", "livraisons", "produits" }, allowSetters = true)
    private Commande commande;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Facture id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumerofacture() {
        return this.numerofacture;
    }

    public Facture numerofacture(Integer numerofacture) {
        this.setNumerofacture(numerofacture);
        return this;
    }

    public void setNumerofacture(Integer numerofacture) {
        this.numerofacture = numerofacture;
    }

    public Instant getDatefacture() {
        return this.datefacture;
    }

    public Facture datefacture(Instant datefacture) {
        this.setDatefacture(datefacture);
        return this;
    }

    public void setDatefacture(Instant datefacture) {
        this.datefacture = datefacture;
    }

    public Double getMontant() {
        return this.montant;
    }

    public Facture montant(Double montant) {
        this.setMontant(montant);
        return this;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public Commande getCommande() {
        return this.commande;
    }

    public void setCommande(Commande commande) {
        this.commande = commande;
    }

    public Facture commande(Commande commande) {
        this.setCommande(commande);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Facture)) {
            return false;
        }
        return id != null && id.equals(((Facture) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Facture{" +
            "id=" + getId() +
            ", numerofacture=" + getNumerofacture() +
            ", datefacture='" + getDatefacture() + "'" +
            ", montant=" + getMontant() +
            "}";
    }
}
