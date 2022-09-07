import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LivraisonDetailComponent } from './livraison-detail.component';

describe('Livraison Management Detail Component', () => {
  let comp: LivraisonDetailComponent;
  let fixture: ComponentFixture<LivraisonDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivraisonDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ livraison: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LivraisonDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LivraisonDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load livraison on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.livraison).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
