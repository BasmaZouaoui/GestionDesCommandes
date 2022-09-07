import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProduitsComponent } from '../list/produits.component';
import { ProduitsDetailComponent } from '../detail/produits-detail.component';
import { ProduitsUpdateComponent } from '../update/produits-update.component';
import { ProduitsRoutingResolveService } from './produits-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const produitsRoute: Routes = [
  {
    path: '',
    component: ProduitsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProduitsDetailComponent,
    resolve: {
      produits: ProduitsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProduitsUpdateComponent,
    resolve: {
      produits: ProduitsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProduitsUpdateComponent,
    resolve: {
      produits: ProduitsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(produitsRoute)],
  exports: [RouterModule],
})
export class ProduitsRoutingModule {}
