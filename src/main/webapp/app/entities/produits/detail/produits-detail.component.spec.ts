import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProduitsDetailComponent } from './produits-detail.component';

describe('Produits Management Detail Component', () => {
  let comp: ProduitsDetailComponent;
  let fixture: ComponentFixture<ProduitsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProduitsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ produits: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProduitsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProduitsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load produits on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.produits).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
