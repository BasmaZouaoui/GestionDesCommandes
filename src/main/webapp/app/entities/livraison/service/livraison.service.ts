import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILivraison, NewLivraison } from '../livraison.model';

export type PartialUpdateLivraison = Partial<ILivraison> & Pick<ILivraison, 'id'>;

type RestOf<T extends ILivraison | NewLivraison> = Omit<T, 'datelivraison'> & {
  datelivraison?: string | null;
};

export type RestLivraison = RestOf<ILivraison>;

export type NewRestLivraison = RestOf<NewLivraison>;

export type PartialUpdateRestLivraison = RestOf<PartialUpdateLivraison>;

export type EntityResponseType = HttpResponse<ILivraison>;
export type EntityArrayResponseType = HttpResponse<ILivraison[]>;

@Injectable({ providedIn: 'root' })
export class LivraisonService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/livraisons');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(livraison: NewLivraison): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(livraison);
    return this.http
      .post<RestLivraison>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(livraison: ILivraison): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(livraison);
    return this.http
      .put<RestLivraison>(`${this.resourceUrl}/${this.getLivraisonIdentifier(livraison)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(livraison: PartialUpdateLivraison): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(livraison);
    return this.http
      .patch<RestLivraison>(`${this.resourceUrl}/${this.getLivraisonIdentifier(livraison)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLivraison>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLivraison[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLivraisonIdentifier(livraison: Pick<ILivraison, 'id'>): number {
    return livraison.id;
  }

  compareLivraison(o1: Pick<ILivraison, 'id'> | null, o2: Pick<ILivraison, 'id'> | null): boolean {
    return o1 && o2 ? this.getLivraisonIdentifier(o1) === this.getLivraisonIdentifier(o2) : o1 === o2;
  }

  addLivraisonToCollectionIfMissing<Type extends Pick<ILivraison, 'id'>>(
    livraisonCollection: Type[],
    ...livraisonsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const livraisons: Type[] = livraisonsToCheck.filter(isPresent);
    if (livraisons.length > 0) {
      const livraisonCollectionIdentifiers = livraisonCollection.map(livraisonItem => this.getLivraisonIdentifier(livraisonItem)!);
      const livraisonsToAdd = livraisons.filter(livraisonItem => {
        const livraisonIdentifier = this.getLivraisonIdentifier(livraisonItem);
        if (livraisonCollectionIdentifiers.includes(livraisonIdentifier)) {
          return false;
        }
        livraisonCollectionIdentifiers.push(livraisonIdentifier);
        return true;
      });
      return [...livraisonsToAdd, ...livraisonCollection];
    }
    return livraisonCollection;
  }

  protected convertDateFromClient<T extends ILivraison | NewLivraison | PartialUpdateLivraison>(livraison: T): RestOf<T> {
    return {
      ...livraison,
      datelivraison: livraison.datelivraison?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLivraison: RestLivraison): ILivraison {
    return {
      ...restLivraison,
      datelivraison: restLivraison.datelivraison ? dayjs(restLivraison.datelivraison) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLivraison>): HttpResponse<ILivraison> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLivraison[]>): HttpResponse<ILivraison[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
