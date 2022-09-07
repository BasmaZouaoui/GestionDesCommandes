import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProduitsComponent } from './list/produits.component';
import { ProduitsDetailComponent } from './detail/produits-detail.component';
import { ProduitsUpdateComponent } from './update/produits-update.component';
import { ProduitsDeleteDialogComponent } from './delete/produits-delete-dialog.component';
import { ProduitsRoutingModule } from './route/produits-routing.module';

@NgModule({
  imports: [SharedModule, ProduitsRoutingModule],
  declarations: [ProduitsComponent, ProduitsDetailComponent, ProduitsUpdateComponent, ProduitsDeleteDialogComponent],
})
export class ProduitsModule {}
