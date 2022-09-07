import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFacture, NewFacture } from '../facture.model';

export type PartialUpdateFacture = Partial<IFacture> & Pick<IFacture, 'id'>;

type RestOf<T extends IFacture | NewFacture> = Omit<T, 'datefacture'> & {
  datefacture?: string | null;
};

export type RestFacture = RestOf<IFacture>;

export type NewRestFacture = RestOf<NewFacture>;

export type PartialUpdateRestFacture = RestOf<PartialUpdateFacture>;

export type EntityResponseType = HttpResponse<IFacture>;
export type EntityArrayResponseType = HttpResponse<IFacture[]>;

@Injectable({ providedIn: 'root' })
export class FactureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/factures');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(facture: NewFacture): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(facture);
    return this.http
      .post<RestFacture>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(facture: IFacture): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(facture);
    return this.http
      .put<RestFacture>(`${this.resourceUrl}/${this.getFactureIdentifier(facture)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(facture: PartialUpdateFacture): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(facture);
    return this.http
      .patch<RestFacture>(`${this.resourceUrl}/${this.getFactureIdentifier(facture)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFacture>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFacture[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFactureIdentifier(facture: Pick<IFacture, 'id'>): number {
    return facture.id;
  }

  compareFacture(o1: Pick<IFacture, 'id'> | null, o2: Pick<IFacture, 'id'> | null): boolean {
    return o1 && o2 ? this.getFactureIdentifier(o1) === this.getFactureIdentifier(o2) : o1 === o2;
  }

  addFactureToCollectionIfMissing<Type extends Pick<IFacture, 'id'>>(
    factureCollection: Type[],
    ...facturesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const factures: Type[] = facturesToCheck.filter(isPresent);
    if (factures.length > 0) {
      const factureCollectionIdentifiers = factureCollection.map(factureItem => this.getFactureIdentifier(factureItem)!);
      const facturesToAdd = factures.filter(factureItem => {
        const factureIdentifier = this.getFactureIdentifier(factureItem);
        if (factureCollectionIdentifiers.includes(factureIdentifier)) {
          return false;
        }
        factureCollectionIdentifiers.push(factureIdentifier);
        return true;
      });
      return [...facturesToAdd, ...factureCollection];
    }
    return factureCollection;
  }

  protected convertDateFromClient<T extends IFacture | NewFacture | PartialUpdateFacture>(facture: T): RestOf<T> {
    return {
      ...facture,
      datefacture: facture.datefacture?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFacture: RestFacture): IFacture {
    return {
      ...restFacture,
      datefacture: restFacture.datefacture ? dayjs(restFacture.datefacture) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFacture>): HttpResponse<IFacture> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFacture[]>): HttpResponse<IFacture[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
