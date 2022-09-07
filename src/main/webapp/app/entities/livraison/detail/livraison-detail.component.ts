import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILivraison } from '../livraison.model';

@Component({
  selector: 'jhi-livraison-detail',
  templateUrl: './livraison-detail.component.html',
})
export class LivraisonDetailComponent implements OnInit {
  livraison: ILivraison | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ livraison }) => {
      this.livraison = livraison;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
