import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProduits, NewProduits } from '../produits.model';

export type PartialUpdateProduits = Partial<IProduits> & Pick<IProduits, 'id'>;

export type EntityResponseType = HttpResponse<IProduits>;
export type EntityArrayResponseType = HttpResponse<IProduits[]>;

@Injectable({ providedIn: 'root' })
export class ProduitsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/produits');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(produits: NewProduits): Observable<EntityResponseType> {
    return this.http.post<IProduits>(this.resourceUrl, produits, { observe: 'response' });
  }

  update(produits: IProduits): Observable<EntityResponseType> {
    return this.http.put<IProduits>(`${this.resourceUrl}/${this.getProduitsIdentifier(produits)}`, produits, { observe: 'response' });
  }

  partialUpdate(produits: PartialUpdateProduits): Observable<EntityResponseType> {
    return this.http.patch<IProduits>(`${this.resourceUrl}/${this.getProduitsIdentifier(produits)}`, produits, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProduits>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProduits[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProduitsIdentifier(produits: Pick<IProduits, 'id'>): number {
    return produits.id;
  }

  compareProduits(o1: Pick<IProduits, 'id'> | null, o2: Pick<IProduits, 'id'> | null): boolean {
    return o1 && o2 ? this.getProduitsIdentifier(o1) === this.getProduitsIdentifier(o2) : o1 === o2;
  }

  addProduitsToCollectionIfMissing<Type extends Pick<IProduits, 'id'>>(
    produitsCollection: Type[],
    ...produitsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const produits: Type[] = produitsToCheck.filter(isPresent);
    if (produits.length > 0) {
      const produitsCollectionIdentifiers = produitsCollection.map(produitsItem => this.getProduitsIdentifier(produitsItem)!);
      const produitsToAdd = produits.filter(produitsItem => {
        const produitsIdentifier = this.getProduitsIdentifier(produitsItem);
        if (produitsCollectionIdentifiers.includes(produitsIdentifier)) {
          return false;
        }
        produitsCollectionIdentifiers.push(produitsIdentifier);
        return true;
      });
      return [...produitsToAdd, ...produitsCollection];
    }
    return produitsCollection;
  }
}
