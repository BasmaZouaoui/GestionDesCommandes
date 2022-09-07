import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LivraisonFormService } from './livraison-form.service';
import { LivraisonService } from '../service/livraison.service';
import { ILivraison } from '../livraison.model';
import { ICommande } from 'app/entities/commande/commande.model';
import { CommandeService } from 'app/entities/commande/service/commande.service';

import { LivraisonUpdateComponent } from './livraison-update.component';

describe('Livraison Management Update Component', () => {
  let comp: LivraisonUpdateComponent;
  let fixture: ComponentFixture<LivraisonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let livraisonFormService: LivraisonFormService;
  let livraisonService: LivraisonService;
  let commandeService: CommandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LivraisonUpdateComponent],
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
      .overrideTemplate(LivraisonUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LivraisonUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    livraisonFormService = TestBed.inject(LivraisonFormService);
    livraisonService = TestBed.inject(LivraisonService);
    commandeService = TestBed.inject(CommandeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Commande query and add missing value', () => {
      const livraison: ILivraison = { id: 456 };
      const commande: ICommande = { id: 12674 };
      livraison.commande = commande;

      const commandeCollection: ICommande[] = [{ id: 92221 }];
      jest.spyOn(commandeService, 'query').mockReturnValue(of(new HttpResponse({ body: commandeCollection })));
      const additionalCommandes = [commande];
      const expectedCollection: ICommande[] = [...additionalCommandes, ...commandeCollection];
      jest.spyOn(commandeService, 'addCommandeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ livraison });
      comp.ngOnInit();

      expect(commandeService.query).toHaveBeenCalled();
      expect(commandeService.addCommandeToCollectionIfMissing).toHaveBeenCalledWith(
        commandeCollection,
        ...additionalCommandes.map(expect.objectContaining)
      );
      expect(comp.commandesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const livraison: ILivraison = { id: 456 };
      const commande: ICommande = { id: 4077 };
      livraison.commande = commande;

      activatedRoute.data = of({ livraison });
      comp.ngOnInit();

      expect(comp.commandesSharedCollection).toContain(commande);
      expect(comp.livraison).toEqual(livraison);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivraison>>();
      const livraison = { id: 123 };
      jest.spyOn(livraisonFormService, 'getLivraison').mockReturnValue(livraison);
      jest.spyOn(livraisonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livraison });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: livraison }));
      saveSubject.complete();

      // THEN
      expect(livraisonFormService.getLivraison).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(livraisonService.update).toHaveBeenCalledWith(expect.objectContaining(livraison));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivraison>>();
      const livraison = { id: 123 };
      jest.spyOn(livraisonFormService, 'getLivraison').mockReturnValue({ id: null });
      jest.spyOn(livraisonService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livraison: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: livraison }));
      saveSubject.complete();

      // THEN
      expect(livraisonFormService.getLivraison).toHaveBeenCalled();
      expect(livraisonService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivraison>>();
      const livraison = { id: 123 };
      jest.spyOn(livraisonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livraison });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(livraisonService.update).toHaveBeenCalled();
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
