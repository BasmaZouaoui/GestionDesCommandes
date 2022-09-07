import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICommande, NewCommande } from '../commande.model';

export type PartialUpdateCommande = Partial<ICommande> & Pick<ICommande, 'id'>;

type RestOf<T extends ICommande | NewCommande> = Omit<T, 'datecommande'> & {
  datecommande?: string | null;
};

export type RestCommande = RestOf<ICommande>;

export type NewRestCommande = RestOf<NewCommande>;

export type PartialUpdateRestCommande = RestOf<PartialUpdateCommande>;

export type EntityResponseType = HttpResponse<ICommande>;
export type EntityArrayResponseType = HttpResponse<ICommande[]>;

@Injectable({ providedIn: 'root' })
export class CommandeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/commandes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(commande: NewCommande): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(commande);
    return this.http
      .post<RestCommande>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(commande: ICommande): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(commande);
    return this.http
      .put<RestCommande>(`${this.resourceUrl}/${this.getCommandeIdentifier(commande)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(commande: PartialUpdateCommande): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(commande);
    return this.http
      .patch<RestCommande>(`${this.resourceUrl}/${this.getCommandeIdentifier(commande)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCommande>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCommande[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCommandeIdentifier(commande: Pick<ICommande, 'id'>): number {
    return commande.id;
  }

  compareCommande(o1: Pick<ICommande, 'id'> | null, o2: Pick<ICommande, 'id'> | null): boolean {
    return o1 && o2 ? this.getCommandeIdentifier(o1) === this.getCommandeIdentifier(o2) : o1 === o2;
  }

  addCommandeToCollectionIfMissing<Type extends Pick<ICommande, 'id'>>(
    commandeCollection: Type[],
    ...commandesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const commandes: Type[] = commandesToCheck.filter(isPresent);
    if (commandes.length > 0) {
      const commandeCollectionIdentifiers = commandeCollection.map(commandeItem => this.getCommandeIdentifier(commandeItem)!);
      const commandesToAdd = commandes.filter(commandeItem => {
        const commandeIdentifier = this.getCommandeIdentifier(commandeItem);
        if (commandeCollectionIdentifiers.includes(commandeIdentifier)) {
          return false;
        }
        commandeCollectionIdentifiers.push(commandeIdentifier);
        return true;
      });
      return [...commandesToAdd, ...commandeCollection];
    }
    return commandeCollection;
  }

  protected convertDateFromClient<T extends ICommande | NewCommande | PartialUpdateCommande>(commande: T): RestOf<T> {
    return {
      ...commande,
      datecommande: commande.datecommande?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCommande: RestCommande): ICommande {
    return {
      ...restCommande,
      datecommande: restCommande.datecommande ? dayjs(restCommande.datecommande) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCommande>): HttpResponse<ICommande> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCommande[]>): HttpResponse<ICommande[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
