import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FactureComponent } from './list/facture.component';
import { FactureDetailComponent } from './detail/facture-detail.component';
import { FactureUpdateComponent } from './update/facture-update.component';
import { FactureDeleteDialogComponent } from './delete/facture-delete-dialog.component';
import { FactureRoutingModule } from './route/facture-routing.module';

@NgModule({
  imports: [SharedModule, FactureRoutingModule],
  declarations: [FactureComponent, FactureDetailComponent, FactureUpdateComponent, FactureDeleteDialogComponent],
})
export class FactureModule {}
