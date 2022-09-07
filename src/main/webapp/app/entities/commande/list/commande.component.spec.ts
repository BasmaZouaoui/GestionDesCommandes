import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CommandeService } from '../service/commande.service';

import { CommandeComponent } from './commande.component';

describe('Commande Management Component', () => {
  let comp: CommandeComponent;
  let fixture: ComponentFixture<CommandeComponent>;
  let service: CommandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'commande', component: CommandeComponent }]), HttpClientTestingModule],
      declarations: [CommandeComponent],
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
      .overrideTemplate(CommandeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommandeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CommandeService);

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
    expect(comp.commandes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to commandeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCommandeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCommandeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
