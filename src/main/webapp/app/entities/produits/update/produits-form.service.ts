import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProduits, NewProduits } from '../produits.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProduits for edit and NewProduitsFormGroupInput for create.
 */
type ProduitsFormGroupInput = IProduits | PartialWithRequiredKeyOf<NewProduits>;

type ProduitsFormDefaults = Pick<NewProduits, 'id' | 'commandes'>;

type ProduitsFormGroupContent = {
  id: FormControl<IProduits['id'] | NewProduits['id']>;
  numeroproduit: FormControl<IProduits['numeroproduit']>;
  nomproduit: FormControl<IProduits['nomproduit']>;
  quantite: FormControl<IProduits['quantite']>;
  prix: FormControl<IProduits['prix']>;
  commandes: FormControl<IProduits['commandes']>;
};

export type ProduitsFormGroup = FormGroup<ProduitsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProduitsFormService {
  createProduitsFormGroup(produits: ProduitsFormGroupInput = { id: null }): ProduitsFormGroup {
    const produitsRawValue = {
      ...this.getFormDefaults(),
      ...produits,
    };
    return new FormGroup<ProduitsFormGroupContent>({
      id: new FormControl(
        { value: produitsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      numeroproduit: new FormControl(produitsRawValue.numeroproduit),
      nomproduit: new FormControl(produitsRawValue.nomproduit),
      quantite: new FormControl(produitsRawValue.quantite),
      prix: new FormControl(produitsRawValue.prix),
      commandes: new FormControl(produitsRawValue.commandes ?? []),
    });
  }

  getProduits(form: ProduitsFormGroup): IProduits | NewProduits {
    return form.getRawValue() as IProduits | NewProduits;
  }

  resetForm(form: ProduitsFormGroup, produits: ProduitsFormGroupInput): void {
    const produitsRawValue = { ...this.getFormDefaults(), ...produits };
    form.reset(
      {
        ...produitsRawValue,
        id: { value: produitsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProduitsFormDefaults {
    return {
      id: null,
      commandes: [],
    };
  }
}
