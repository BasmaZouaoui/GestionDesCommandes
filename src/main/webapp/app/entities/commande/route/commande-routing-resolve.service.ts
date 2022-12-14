import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICommande } from '../commande.model';
import { CommandeService } from '../service/commande.service';

@Injectable({ providedIn: 'root' })
export class CommandeRoutingResolveService implements Resolve<ICommande | null> {
  constructor(protected service: CommandeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICommande | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((commande: HttpResponse<ICommande>) => {
          if (commande.body) {
            return of(commande.body);
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
