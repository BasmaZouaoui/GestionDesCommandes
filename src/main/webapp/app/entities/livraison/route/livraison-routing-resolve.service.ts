import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILivraison } from '../livraison.model';
import { LivraisonService } from '../service/livraison.service';

@Injectable({ providedIn: 'root' })
export class LivraisonRoutingResolveService implements Resolve<ILivraison | null> {
  constructor(protected service: LivraisonService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILivraison | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((livraison: HttpResponse<ILivraison>) => {
          if (livraison.body) {
            return of(livraison.body);
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
