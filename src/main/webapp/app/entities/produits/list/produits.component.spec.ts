import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProduitsService } from '../service/produits.service';

import { ProduitsComponent } from './produits.component';

describe('Produits Management Component', () => {
  let comp: ProduitsComponent;
  let fixture: ComponentFixture<ProduitsComponent>;
  let service: ProduitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'produits', component: ProduitsComponent }]), HttpClientTestingModule],
      declarations: [ProduitsComponent],
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
      .overrideTemplate(ProduitsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProduitsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProduitsService);

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
    expect(comp.produits?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to produitsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProduitsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProduitsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
