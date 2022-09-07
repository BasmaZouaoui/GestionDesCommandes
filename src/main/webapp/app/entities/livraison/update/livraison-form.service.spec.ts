import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../livraison.test-samples';

import { LivraisonFormService } from './livraison-form.service';

describe('Livraison Form Service', () => {
  let service: LivraisonFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivraisonFormService);
  });

  describe('Service methods', () => {
    describe('createLivraisonFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLivraisonFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numerolivraison: expect.any(Object),
            datelivraison: expect.any(Object),
            commande: expect.any(Object),
          })
        );
      });

      it('passing ILivraison should create a new form with FormGroup', () => {
        const formGroup = service.createLivraisonFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numerolivraison: expect.any(Object),
            datelivraison: expect.any(Object),
            commande: expect.any(Object),
          })
        );
      });
    });

    describe('getLivraison', () => {
      it('should return NewLivraison for default Livraison initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLivraisonFormGroup(sampleWithNewData);

        const livraison = service.getLivraison(formGroup) as any;

        expect(livraison).toMatchObject(sampleWithNewData);
      });

      it('should return NewLivraison for empty Livraison initial value', () => {
        const formGroup = service.createLivraisonFormGroup();

        const livraison = service.getLivraison(formGroup) as any;

        expect(livraison).toMatchObject({});
      });

      it('should return ILivraison', () => {
        const formGroup = service.createLivraisonFormGroup(sampleWithRequiredData);

        const livraison = service.getLivraison(formGroup) as any;

        expect(livraison).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILivraison should not enable id FormControl', () => {
        const formGroup = service.createLivraisonFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLivraison should disable id FormControl', () => {
        const formGroup = service.createLivraisonFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
