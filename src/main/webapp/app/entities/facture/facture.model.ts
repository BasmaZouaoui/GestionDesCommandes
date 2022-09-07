import dayjs from 'dayjs/esm';
import { ICommande } from 'app/entities/commande/commande.model';

export interface IFacture {
  id: number;
  numerofacture?: number | null;
  datefacture?: dayjs.Dayjs | null;
  montant?: number | null;
  commande?: Pick<ICommande, 'id' | 'numerocommande'> | null;
}

export type NewFacture = Omit<IFacture, 'id'> & { id: null };
