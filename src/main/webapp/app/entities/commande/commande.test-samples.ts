import dayjs from 'dayjs/esm';

import { ICommande, NewCommande } from './commande.model';

export const sampleWithRequiredData: ICommande = {
  id: 5189,
};

export const sampleWithPartialData: ICommande = {
  id: 97722,
  numerocommande: 42552,
};

export const sampleWithFullData: ICommande = {
  id: 99518,
  numerocommande: 4218,
  datecommande: dayjs('2022-09-06T17:27'),
};

export const sampleWithNewData: NewCommande = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
