import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILivraison } from '../livraison.model';
import { LivraisonService } from '../service/livraison.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './livraison-delete-dialog.component.html',
})
export class LivraisonDeleteDialogComponent {
  livraison?: ILivraison;

  constructor(protected livraisonService: LivraisonService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.livraisonService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
