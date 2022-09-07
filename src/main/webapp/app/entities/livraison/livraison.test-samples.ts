import dayjs from 'dayjs/esm';

import { ILivraison, NewLivraison } from './livraison.model';

export const sampleWithRequiredData: ILivraison = {
  id: 49857,
};

export const sampleWithPartialData: ILivraison = {
  id: 69302,
  numerolivraison: 70942,
  datelivraison: dayjs('2022-09-06T05:01'),
};

export const sampleWithFullData: ILivraison = {
  id: 30355,
  numerolivraison: 31606,
  datelivraison: dayjs('2022-09-06T01:29'),
};

export const sampleWithNewData: NewLivraison = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
