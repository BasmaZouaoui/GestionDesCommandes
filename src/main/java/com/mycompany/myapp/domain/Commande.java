package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Commande.
 */
@Entity
@Table(name = "commande")
public class Commande implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "numerocommande")
    private Integer numerocommande;

    @Column(name = "datecommande")
    private Instant datecommande;

    @ManyToOne
    @JsonIgnoreProperties(value = { "commandes" }, allowSetters = true)
    private Client client;

    @OneToMany(mappedBy = "commande")
    @JsonIgnoreProperties(value = { "commande" }, allowSetters = true)
    private Set<Facture> factures = new HashSet<>();

    @OneToMany(mappedBy = "commande")
    @JsonIgnoreProperties(value = { "commande" }, allowSetters = true)
    private Set<Livraison> livraisons = new HashSet<>();

    @ManyToMany(mappedBy = "commandes")
    @JsonIgnoreProperties(value = { "commandes" }, allowSetters = true)
    private Set<Produits> produits = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Commande id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumerocommande() {
        return this.numerocommande;
    }

    public Commande numerocommande(Integer numerocommande) {
        this.setNumerocommande(numerocommande);
        return this;
    }

    public void setNumerocommande(Integer numerocommande) {
        this.numerocommande = numerocommande;
    }

    public Instant getDatecommande() {
        return this.datecommande;
    }

    public Commande datecommande(Instant datecommande) {
        this.setDatecommande(datecommande);
        return this;
    }

    public void setDatecommande(Instant datecommande) {
        this.datecommande = datecommande;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Commande client(Client client) {
        this.setClient(client);
        return this;
    }

    public Set<Facture> getFactures() {
        return this.factures;
    }

    public void setFactures(Set<Facture> factures) {
        if (this.factures != null) {
            this.factures.forEach(i -> i.setCommande(null));
        }
        if (factures != null) {
            factures.forEach(i -> i.setCommande(this));
        }
        this.factures = factures;
    }

    public Commande factures(Set<Facture> factures) {
        this.setFactures(factures);
        return this;
    }

    public Commande addFacture(Facture facture) {
        this.factures.add(facture);
        facture.setCommande(this);
        return this;
    }

    public Commande removeFacture(Facture facture) {
        this.factures.remove(facture);
        facture.setCommande(null);
        return this;
    }

    public Set<Livraison> getLivraisons() {
        return this.livraisons;
    }

    public void setLivraisons(Set<Livraison> livraisons) {
        if (this.livraisons != null) {
            this.livraisons.forEach(i -> i.setCommande(null));
        }
        if (livraisons != null) {
            livraisons.forEach(i -> i.setCommande(this));
        }
        this.livraisons = livraisons;
    }

    public Commande livraisons(Set<Livraison> livraisons) {
        this.setLivraisons(livraisons);
        return this;
    }

    public Commande addLivraison(Livraison livraison) {
        this.livraisons.add(livraison);
        livraison.setCommande(this);
        return this;
    }

    public Commande removeLivraison(Livraison livraison) {
        this.livraisons.remove(livraison);
        livraison.setCommande(null);
        return this;
    }

    public Set<Produits> getProduits() {
        return this.produits;
    }

    public void setProduits(Set<Produits> produits) {
        if (this.produits != null) {
            this.produits.forEach(i -> i.removeCommande(this));
        }
        if (produits != null) {
            produits.forEach(i -> i.addCommande(this));
        }
        this.produits = produits;
    }

    public Commande produits(Set<Produits> produits) {
        this.setProduits(produits);
        return this;
    }

    public Commande addProduits(Produits produits) {
        this.produits.add(produits);
        produits.getCommandes().add(this);
        return this;
    }

    public Commande removeProduits(Produits produits) {
        this.produits.remove(produits);
        produits.getCommandes().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Commande)) {
            return false;
        }
        return id != null && id.equals(((Commande) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Commande{" +
            "id=" + getId() +
            ", numerocommande=" + getNumerocommande() +
            ", datecommande='" + getDatecommande() + "'" +
            "}";
    }
}
