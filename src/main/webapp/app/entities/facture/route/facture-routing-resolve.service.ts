import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFacture } from '../facture.model';
import { FactureService } from '../service/facture.service';

@Injectable({ providedIn: 'root' })
export class FactureRoutingResolveService implements Resolve<IFacture | null> {
  constructor(protected service: FactureService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFacture | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((facture: HttpResponse<IFacture>) => {
          if (facture.body) {
            return of(facture.body);
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
