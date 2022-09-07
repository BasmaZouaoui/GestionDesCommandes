import dayjs from 'dayjs/esm';

import { IFacture, NewFacture } from './facture.model';

export const sampleWithRequiredData: IFacture = {
  id: 59520,
};

export const sampleWithPartialData: IFacture = {
  id: 2378,
  montant: 70074,
};

export const sampleWithFullData: IFacture = {
  id: 12150,
  numerofacture: 75841,
  datefacture: dayjs('2022-09-06T11:31'),
  montant: 38889,
};

export const sampleWithNewData: NewFacture = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
