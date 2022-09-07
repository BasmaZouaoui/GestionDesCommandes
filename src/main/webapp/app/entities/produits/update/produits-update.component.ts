import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProduitsFormService, ProduitsFormGroup } from './produits-form.service';
import { IProduits } from '../produits.model';
import { ProduitsService } from '../service/produits.service';
import { ICommande } from 'app/entities/commande/commande.model';
import { CommandeService } from 'app/entities/commande/service/commande.service';

@Component({
  selector: 'jhi-produits-update',
  templateUrl: './produits-update.component.html',
})
export class ProduitsUpdateComponent implements OnInit {
  isSaving = false;
  produits: IProduits | null = null;

  commandesSharedCollection: ICommande[] = [];

  editForm: ProduitsFormGroup = this.produitsFormService.createProduitsFormGroup();

  constructor(
    protected produitsService: ProduitsService,
    protected produitsFormService: ProduitsFormService,
    protected commandeService: CommandeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCommande = (o1: ICommande | null, o2: ICommande | null): boolean => this.commandeService.compareCommande(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produits }) => {
      this.produits = produits;
      if (produits) {
        this.updateForm(produits);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const produits = this.produitsFormService.getProduits(this.editForm);
    if (produits.id !== null) {
      this.subscribeToSaveResponse(this.produitsService.update(produits));
    } else {
      this.subscribeToSaveResponse(this.produitsService.create(produits));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduits>>): void {
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

  protected updateForm(produits: IProduits): void {
    this.produits = produits;
    this.produitsFormService.resetForm(this.editForm, produits);

    this.commandesSharedCollection = this.commandeService.addCommandeToCollectionIfMissing<ICommande>(
      this.commandesSharedCollection,
      ...(produits.commandes ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.commandeService
      .query()
      .pipe(map((res: HttpResponse<ICommande[]>) => res.body ?? []))
      .pipe(
        map((commandes: ICommande[]) =>
          this.commandeService.addCommandeToCollectionIfMissing<ICommande>(commandes, ...(this.produits?.commandes ?? []))
        )
      )
      .subscribe((commandes: ICommande[]) => (this.commandesSharedCollection = commandes));
  }
}
