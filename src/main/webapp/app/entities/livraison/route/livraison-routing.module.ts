import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LivraisonComponent } from '../list/livraison.component';
import { LivraisonDetailComponent } from '../detail/livraison-detail.component';
import { LivraisonUpdateComponent } from '../update/livraison-update.component';
import { LivraisonRoutingResolveService } from './livraison-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const livraisonRoute: Routes = [
  {
    path: '',
    component: LivraisonComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LivraisonDetailComponent,
    resolve: {
      livraison: LivraisonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LivraisonUpdateComponent,
    resolve: {
      livraison: LivraisonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LivraisonUpdateComponent,
    resolve: {
      livraison: LivraisonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(livraisonRoute)],
  exports: [RouterModule],
})
export class LivraisonRoutingModule {}
