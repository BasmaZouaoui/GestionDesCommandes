import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LivraisonComponent } from './list/livraison.component';
import { LivraisonDetailComponent } from './detail/livraison-detail.component';
import { LivraisonUpdateComponent } from './update/livraison-update.component';
import { LivraisonDeleteDialogComponent } from './delete/livraison-delete-dialog.component';
import { LivraisonRoutingModule } from './route/livraison-routing.module';

@NgModule({
  imports: [SharedModule, LivraisonRoutingModule],
  declarations: [LivraisonComponent, LivraisonDetailComponent, LivraisonUpdateComponent, LivraisonDeleteDialogComponent],
})
export class LivraisonModule {}
