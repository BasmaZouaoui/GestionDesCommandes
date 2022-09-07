import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProduits } from '../produits.model';

@Component({
  selector: 'jhi-produits-detail',
  templateUrl: './produits-detail.component.html',
})
export class ProduitsDetailComponent implements OnInit {
  produits: IProduits | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produits }) => {
      this.produits = produits;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
