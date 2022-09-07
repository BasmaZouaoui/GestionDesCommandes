import { ICommande } from 'app/entities/commande/commande.model';

export interface IProduits {
  id: number;
  numeroproduit?: number | null;
  nomproduit?: string | null;
  quantite?: number | null;
  prix?: number | null;
  commandes?: Pick<ICommande, 'id' | 'numerocommande'>[] | null;
}

export type NewProduits = Omit<IProduits, 'id'> & { id: null };
