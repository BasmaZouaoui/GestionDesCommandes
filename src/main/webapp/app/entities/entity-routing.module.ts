import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'client',
        data: { pageTitle: 'gestionDesCommandesApp.client.home.title' },
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'commande',
        data: { pageTitle: 'gestionDesCommandesApp.commande.home.title' },
        loadChildren: () => import('./commande/commande.module').then(m => m.CommandeModule),
      },
      {
        path: 'produits',
        data: { pageTitle: 'gestionDesCommandesApp.produits.home.title' },
        loadChildren: () => import('./produits/produits.module').then(m => m.ProduitsModule),
      },
      {
        path: 'facture',
        data: { pageTitle: 'gestionDesCommandesApp.facture.home.title' },
        loadChildren: () => import('./facture/facture.module').then(m => m.FactureModule),
      },
      {
        path: 'livraison',
        data: { pageTitle: 'gestionDesCommandesApp.livraison.home.title' },
        loadChildren: () => import('./livraison/livraison.module').then(m => m.LivraisonModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
