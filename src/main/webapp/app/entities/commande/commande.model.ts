import dayjs from 'dayjs/esm';
import { IClient } from 'app/entities/client/client.model';
import { IProduits } from 'app/entities/produits/produits.model';

export interface ICommande {
  id: number;
  numerocommande?: number | null;
  datecommande?: dayjs.Dayjs | null;
  client?: Pick<IClient, 'id' | 'numeroclient'> | null;
  produits?: Pick<IProduits, 'id'>[] | null;
}

export type NewCommande = Omit<ICommande, 'id'> & { id: null };
