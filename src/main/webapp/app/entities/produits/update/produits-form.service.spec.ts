import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../produits.test-samples';

import { ProduitsFormService } from './produits-form.service';

describe('Produits Form Service', () => {
  let service: ProduitsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProduitsFormService);
  });

  describe('Service methods', () => {
    describe('createProduitsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProduitsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroproduit: expect.any(Object),
            nomproduit: expect.any(Object),
            quantite: expect.any(Object),
            prix: expect.any(Object),
            commandes: expect.any(Object),
          })
        );
      });

      it('passing IProduits should create a new form with FormGroup', () => {
        const formGroup = service.createProduitsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroproduit: expect.any(Object),
            nomproduit: expect.any(Object),
            quantite: expect.any(Object),
            prix: expect.any(Object),
            commandes: expect.any(Object),
          })
        );
      });
    });

    describe('getProduits', () => {
      it('should return NewProduits for default Produits initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProduitsFormGroup(sampleWithNewData);

        const produits = service.getProduits(formGroup) as any;

        expect(produits).toMatchObject(sampleWithNewData);
      });

      it('should return NewProduits for empty Produits initial value', () => {
        const formGroup = service.createProduitsFormGroup();

        const produits = service.getProduits(formGroup) as any;

        expect(produits).toMatchObject({});
      });

      it('should return IProduits', () => {
        const formGroup = service.createProduitsFormGroup(sampleWithRequiredData);

        const produits = service.getProduits(formGroup) as any;

        expect(produits).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProduits should not enable id FormControl', () => {
        const formGroup = service.createProduitsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProduits should disable id FormControl', () => {
        const formGroup = service.createProduitsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
