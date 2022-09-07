import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProduits } from '../produits.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../produits.test-samples';

import { ProduitsService } from './produits.service';

const requireRestSample: IProduits = {
  ...sampleWithRequiredData,
};

describe('Produits Service', () => {
  let service: ProduitsService;
  let httpMock: HttpTestingController;
  let expectedResult: IProduits | IProduits[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProduitsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Produits', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const produits = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(produits).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Produits', () => {
      const produits = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(produits).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Produits', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Produits', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Produits', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProduitsToCollectionIfMissing', () => {
      it('should add a Produits to an empty array', () => {
        const produits: IProduits = sampleWithRequiredData;
        expectedResult = service.addProduitsToCollectionIfMissing([], produits);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(produits);
      });

      it('should not add a Produits to an array that contains it', () => {
        const produits: IProduits = sampleWithRequiredData;
        const produitsCollection: IProduits[] = [
          {
            ...produits,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProduitsToCollectionIfMissing(produitsCollection, produits);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Produits to an array that doesn't contain it", () => {
        const produits: IProduits = sampleWithRequiredData;
        const produitsCollection: IProduits[] = [sampleWithPartialData];
        expectedResult = service.addProduitsToCollectionIfMissing(produitsCollection, produits);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(produits);
      });

      it('should add only unique Produits to an array', () => {
        const produitsArray: IProduits[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const produitsCollection: IProduits[] = [sampleWithRequiredData];
        expectedResult = service.addProduitsToCollectionIfMissing(produitsCollection, ...produitsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const produits: IProduits = sampleWithRequiredData;
        const produits2: IProduits = sampleWithPartialData;
        expectedResult = service.addProduitsToCollectionIfMissing([], produits, produits2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(produits);
        expect(expectedResult).toContain(produits2);
      });

      it('should accept null and undefined values', () => {
        const produits: IProduits = sampleWithRequiredData;
        expectedResult = service.addProduitsToCollectionIfMissing([], null, produits, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(produits);
      });

      it('should return initial array if no Produits is added', () => {
        const produitsCollection: IProduits[] = [sampleWithRequiredData];
        expectedResult = service.addProduitsToCollectionIfMissing(produitsCollection, undefined, null);
        expect(expectedResult).toEqual(produitsCollection);
      });
    });

    describe('compareProduits', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProduits(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProduits(entity1, entity2);
        const compareResult2 = service.compareProduits(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProduits(entity1, entity2);
        const compareResult2 = service.compareProduits(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProduits(entity1, entity2);
        const compareResult2 = service.compareProduits(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
