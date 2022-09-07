import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFacture } from '../facture.model';

@Component({
  selector: 'jhi-facture-detail',
  templateUrl: './facture-detail.component.html',
})
export class FactureDetailComponent implements OnInit {
  facture: IFacture | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ facture }) => {
      this.facture = facture;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
