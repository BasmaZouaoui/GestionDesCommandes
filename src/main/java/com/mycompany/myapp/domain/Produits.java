package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Produits.
 */
@Entity
@Table(name = "produits")
public class Produits implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "numeroproduit")
    private Integer numeroproduit;

    @Column(name = "nomproduit")
    private String nomproduit;

    @Column(name = "quantite")
    private Integer quantite;

    @Column(name = "prix")
    private Double prix;

    @ManyToMany
    @JoinTable(
        name = "rel_produits__commande",
        joinColumns = @JoinColumn(name = "produits_id"),
        inverseJoinColumns = @JoinColumn(name = "commande_id")
    )
    @JsonIgnoreProperties(value = { "client", "factures", "livraisons", "produits" }, allowSetters = true)
    private Set<Commande> commandes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Produits id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumeroproduit() {
        return this.numeroproduit;
    }

    public Produits numeroproduit(Integer numeroproduit) {
        this.setNumeroproduit(numeroproduit);
        return this;
    }

    public void setNumeroproduit(Integer numeroproduit) {
        this.numeroproduit = numeroproduit;
    }

    public String getNomproduit() {
        return this.nomproduit;
    }

    public Produits nomproduit(String nomproduit) {
        this.setNomproduit(nomproduit);
        return this;
    }

    public void setNomproduit(String nomproduit) {
        this.nomproduit = nomproduit;
    }

    public Integer getQuantite() {
        return this.quantite;
    }

    public Produits quantite(Integer quantite) {
        this.setQuantite(quantite);
        return this;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public Double getPrix() {
        return this.prix;
    }

    public Produits prix(Double prix) {
        this.setPrix(prix);
        return this;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public Set<Commande> getCommandes() {
        return this.commandes;
    }

    public void setCommandes(Set<Commande> commandes) {
        this.commandes = commandes;
    }

    public Produits commandes(Set<Commande> commandes) {
        this.setCommandes(commandes);
        return this;
    }

    public Produits addCommande(Commande commande) {
        this.commandes.add(commande);
        commande.getProduits().add(this);
        return this;
    }

    public Produits removeCommande(Commande commande) {
        this.commandes.remove(commande);
        commande.getProduits().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Produits)) {
            return false;
        }
        return id != null && id.equals(((Produits) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Produits{" +
            "id=" + getId() +
            ", numeroproduit=" + getNumeroproduit() +
            ", nomproduit='" + getNomproduit() + "'" +
            ", quantite=" + getQuantite() +
            ", prix=" + getPrix() +
            "}";
    }
}
