import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProduitsFormService } from './produits-form.service';
import { ProduitsService } from '../service/produits.service';
import { IProduits } from '../produits.model';
import { ICommande } from 'app/entities/commande/commande.model';
import { CommandeService } from 'app/entities/commande/service/commande.service';

import { ProduitsUpdateComponent } from './produits-update.component';

describe('Produits Management Update Component', () => {
  let comp: ProduitsUpdateComponent;
  let fixture: ComponentFixture<ProduitsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let produitsFormService: ProduitsFormService;
  let produitsService: ProduitsService;
  let commandeService: CommandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProduitsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ProduitsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProduitsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    produitsFormService = TestBed.inject(ProduitsFormService);
    produitsService = TestBed.inject(ProduitsService);
    commandeService = TestBed.inject(CommandeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Commande query and add missing value', () => {
      const produits: IProduits = { id: 456 };
      const commandes: ICommande[] = [{ id: 14048 }];
      produits.commandes = commandes;

      const commandeCollection: ICommande[] = [{ id: 32759 }];
      jest.spyOn(commandeService, 'query').mockReturnValue(of(new HttpResponse({ body: commandeCollection })));
      const additionalCommandes = [...commandes];
      const expectedCollection: ICommande[] = [...additionalCommandes, ...commandeCollection];
      jest.spyOn(commandeService, 'addCommandeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ produits });
      comp.ngOnInit();

      expect(commandeService.query).toHaveBeenCalled();
      expect(commandeService.addCommandeToCollectionIfMissing).toHaveBeenCalledWith(
        commandeCollection,
        ...additionalCommandes.map(expect.objectContaining)
      );
      expect(comp.commandesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const produits: IProduits = { id: 456 };
      const commande: ICommande = { id: 69991 };
      produits.commandes = [commande];

      activatedRoute.data = of({ produits });
      comp.ngOnInit();

      expect(comp.commandesSharedCollection).toContain(commande);
      expect(comp.produits).toEqual(produits);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduits>>();
      const produits = { id: 123 };
      jest.spyOn(produitsFormService, 'getProduits').mockReturnValue(produits);
      jest.spyOn(produitsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ produits });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: produits }));
      saveSubject.complete();

      // THEN
      expect(produitsFormService.getProduits).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(produitsService.update).toHaveBeenCalledWith(expect.objectContaining(produits));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduits>>();
      const produits = { id: 123 };
      jest.spyOn(produitsFormService, 'getProduits').mockReturnValue({ id: null });
      jest.spyOn(produitsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ produits: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: produits }));
      saveSubject.complete();

      // THEN
      expect(produitsFormService.getProduits).toHaveBeenCalled();
      expect(produitsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduits>>();
      const produits = { id: 123 };
      jest.spyOn(produitsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ produits });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(produitsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCommande', () => {
      it('Should forward to commandeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(commandeService, 'compareCommande');
        comp.compareCommande(entity, entity2);
        expect(commandeService.compareCommande).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
