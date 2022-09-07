import { IProduits, NewProduits } from './produits.model';

export const sampleWithRequiredData: IProduits = {
  id: 32388,
};

export const sampleWithPartialData: IProduits = {
  id: 43970,
  prix: 78690,
};

export const sampleWithFullData: IProduits = {
  id: 72476,
  numeroproduit: 82200,
  nomproduit: 'Ball c Huchette',
  quantite: 44380,
  prix: 94066,
};

export const sampleWithNewData: NewProduits = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
