import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FactureComponent } from '../list/facture.component';
import { FactureDetailComponent } from '../detail/facture-detail.component';
import { FactureUpdateComponent } from '../update/facture-update.component';
import { FactureRoutingResolveService } from './facture-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const factureRoute: Routes = [
  {
    path: '',
    component: FactureComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FactureDetailComponent,
    resolve: {
      facture: FactureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FactureUpdateComponent,
    resolve: {
      facture: FactureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FactureUpdateComponent,
    resolve: {
      facture: FactureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(factureRoute)],
  exports: [RouterModule],
})
export class FactureRoutingModule {}
