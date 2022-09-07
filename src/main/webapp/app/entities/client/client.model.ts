export interface IClient {
  id: number;
  numeroclient?: number | null;
  nom?: string | null;
  prenom?: string | null;
  adresse?: string | null;
  telephone?: string | null;
}

export type NewClient = Omit<IClient, 'id'> & { id: null };
