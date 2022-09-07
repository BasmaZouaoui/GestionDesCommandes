import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 71655,
};

export const sampleWithPartialData: IClient = {
  id: 81014,
  nom: 'Oberkampf',
  telephone: '+33 612792056',
};

export const sampleWithFullData: IClient = {
  id: 83030,
  numeroclient: 92405,
  nom: 'homogeneous Multi-tiered Table',
  prenom: 'c ability input',
  adresse: 'Autriche',
  telephone: '0674198743',
};

export const sampleWithNewData: NewClient = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
