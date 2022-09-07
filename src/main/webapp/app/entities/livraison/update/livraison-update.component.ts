import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LivraisonFormService, LivraisonFormGroup } from './livraison-form.service';
import { ILivraison } from '../livraison.model';
import { LivraisonService } from '../service/livraison.service';
import { ICommande } from 'app/entities/commande/commande.model';
import { CommandeService } from 'app/entities/commande/service/commande.service';

@Component({
  selector: 'jhi-livraison-update',
  templateUrl: './livraison-update.component.html',
})
export class LivraisonUpdateComponent implements OnInit {
  isSaving = false;
  livraison: ILivraison | null = null;

  commandesSharedCollection: ICommande[] = [];

  editForm: LivraisonFormGroup = this.livraisonFormService.createLivraisonFormGroup();

  constructor(
    protected livraisonService: LivraisonService,
    protected livraisonFormService: LivraisonFormService,
    protected commandeService: CommandeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCommande = (o1: ICommande | null, o2: ICommande | null): boolean => this.commandeService.compareCommande(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ livraison }) => {
      this.livraison = livraison;
      if (livraison) {
        this.updateForm(livraison);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const livraison = this.livraisonFormService.getLivraison(this.editForm);
    if (livraison.id !== null) {
      this.subscribeToSaveResponse(this.livraisonService.update(livraison));
    } else {
      this.subscribeToSaveResponse(this.livraisonService.create(livraison));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILivraison>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(livraison: ILivraison): void {
    this.livraison = livraison;
    this.livraisonFormService.resetForm(this.editForm, livraison);

    this.commandesSharedCollection = this.commandeService.addCommandeToCollectionIfMissing<ICommande>(
      this.commandesSharedCollection,
      livraison.commande
    );
  }

  protected loadRelationshipsOptions(): void {
    this.commandeService
      .query()
      .pipe(map((res: HttpResponse<ICommande[]>) => res.body ?? []))
      .pipe(
        map((commandes: ICommande[]) =>
          this.commandeService.addCommandeToCollectionIfMissing<ICommande>(commandes, this.livraison?.commande)
        )
      )
      .subscribe((commandes: ICommande[]) => (this.commandesSharedCollection = commandes));
  }
}
