import dayjs from 'dayjs/esm';
import { ICommande } from 'app/entities/commande/commande.model';

export interface ILivraison {
  id: number;
  numerolivraison?: number | null;
  datelivraison?: dayjs.Dayjs | null;
  commande?: Pick<ICommande, 'id' | 'numerocommande'> | null;
}

export type NewLivraison = Omit<ILivraison, 'id'> & { id: null };
