import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FactureFormService } from './facture-form.service';
import { FactureService } from '../service/facture.service';
import { IFacture } from '../facture.model';
import { ICommande } from 'app/entities/commande/commande.model';
import { CommandeService } from 'app/entities/commande/service/commande.service';

import { FactureUpdateComponent } from './facture-update.component';

describe('Facture Management Update Component', () => {
  let comp: FactureUpdateComponent;
  let fixture: ComponentFixture<FactureUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let factureFormService: FactureFormService;
  let factureService: FactureService;
  let commandeService: CommandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FactureUpdateComponent],
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
      .overrideTemplate(FactureUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FactureUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    factureFormService = TestBed.inject(FactureFormService);
    factureService = TestBed.inject(FactureService);
    commandeService = TestBed.inject(CommandeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Commande query and add missing value', () => {
      const facture: IFacture = { id: 456 };
      const commande: ICommande = { id: 49643 };
      facture.commande = commande;

      const commandeCollection: ICommande[] = [{ id: 15557 }];
      jest.spyOn(commandeService, 'query').mockReturnValue(of(new HttpResponse({ body: commandeCollection })));
      const additionalCommandes = [commande];
      const expectedCollection: ICommande[] = [...additionalCommandes, ...commandeCollection];
      jest.spyOn(commandeService, 'addCommandeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ facture });
      comp.ngOnInit();

      expect(commandeService.query).toHaveBeenCalled();
      expect(commandeService.addCommandeToCollectionIfMissing).toHaveBeenCalledWith(
        commandeCollection,
        ...additionalCommandes.map(expect.objectContaining)
      );
      expect(comp.commandesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const facture: IFacture = { id: 456 };
      const commande: ICommande = { id: 46398 };
      facture.commande = commande;

      activatedRoute.data = of({ facture });
      comp.ngOnInit();

      expect(comp.commandesSharedCollection).toContain(commande);
      expect(comp.facture).toEqual(facture);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFacture>>();
      const facture = { id: 123 };
      jest.spyOn(factureFormService, 'getFacture').mockReturnValue(facture);
      jest.spyOn(factureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facture });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: facture }));
      saveSubject.complete();

      // THEN
      expect(factureFormService.getFacture).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(factureService.update).toHaveBeenCalledWith(expect.objectContaining(facture));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFacture>>();
      const facture = { id: 123 };
      jest.spyOn(factureFormService, 'getFacture').mockReturnValue({ id: null });
      jest.spyOn(factureService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facture: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: facture }));
      saveSubject.complete();

      // THEN
      expect(factureFormService.getFacture).toHaveBeenCalled();
      expect(factureService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFacture>>();
      const facture = { id: 123 };
      jest.spyOn(factureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facture });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(factureService.update).toHaveBeenCalled();
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
