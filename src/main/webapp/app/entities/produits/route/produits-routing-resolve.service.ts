import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProduits } from '../produits.model';
import { ProduitsService } from '../service/produits.service';

@Injectable({ providedIn: 'root' })
export class ProduitsRoutingResolveService implements Resolve<IProduits | null> {
  constructor(protected service: ProduitsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProduits | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((produits: HttpResponse<IProduits>) => {
          if (produits.body) {
            return of(produits.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
