import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LivraisonService } from '../service/livraison.service';

import { LivraisonComponent } from './livraison.component';

describe('Livraison Management Component', () => {
  let comp: LivraisonComponent;
  let fixture: ComponentFixture<LivraisonComponent>;
  let service: LivraisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'livraison', component: LivraisonComponent }]), HttpClientTestingModule],
      declarations: [LivraisonComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(LivraisonComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LivraisonComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LivraisonService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.livraisons?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to livraisonService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLivraisonIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLivraisonIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
