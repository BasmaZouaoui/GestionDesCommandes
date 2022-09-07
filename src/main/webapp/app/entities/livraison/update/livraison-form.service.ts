import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILivraison, NewLivraison } from '../livraison.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILivraison for edit and NewLivraisonFormGroupInput for create.
 */
type LivraisonFormGroupInput = ILivraison | PartialWithRequiredKeyOf<NewLivraison>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILivraison | NewLivraison> = Omit<T, 'datelivraison'> & {
  datelivraison?: string | null;
};

type LivraisonFormRawValue = FormValueOf<ILivraison>;

type NewLivraisonFormRawValue = FormValueOf<NewLivraison>;

type LivraisonFormDefaults = Pick<NewLivraison, 'id' | 'datelivraison'>;

type LivraisonFormGroupContent = {
  id: FormControl<LivraisonFormRawValue['id'] | NewLivraison['id']>;
  numerolivraison: FormControl<LivraisonFormRawValue['numerolivraison']>;
  datelivraison: FormControl<LivraisonFormRawValue['datelivraison']>;
  commande: FormControl<LivraisonFormRawValue['commande']>;
};

export type LivraisonFormGroup = FormGroup<LivraisonFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LivraisonFormService {
  createLivraisonFormGroup(livraison: LivraisonFormGroupInput = { id: null }): LivraisonFormGroup {
    const livraisonRawValue = this.convertLivraisonToLivraisonRawValue({
      ...this.getFormDefaults(),
      ...livraison,
    });
    return new FormGroup<LivraisonFormGroupContent>({
      id: new FormControl(
        { value: livraisonRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      numerolivraison: new FormControl(livraisonRawValue.numerolivraison),
      datelivraison: new FormControl(livraisonRawValue.datelivraison),
      commande: new FormControl(livraisonRawValue.commande),
    });
  }

  getLivraison(form: LivraisonFormGroup): ILivraison | NewLivraison {
    return this.convertLivraisonRawValueToLivraison(form.getRawValue() as LivraisonFormRawValue | NewLivraisonFormRawValue);
  }

  resetForm(form: LivraisonFormGroup, livraison: LivraisonFormGroupInput): void {
    const livraisonRawValue = this.convertLivraisonToLivraisonRawValue({ ...this.getFormDefaults(), ...livraison });
    form.reset(
      {
        ...livraisonRawValue,
        id: { value: livraisonRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LivraisonFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      datelivraison: currentTime,
    };
  }

  private convertLivraisonRawValueToLivraison(rawLivraison: LivraisonFormRawValue | NewLivraisonFormRawValue): ILivraison | NewLivraison {
    return {
      ...rawLivraison,
      datelivraison: dayjs(rawLivraison.datelivraison, DATE_TIME_FORMAT),
    };
  }

  private convertLivraisonToLivraisonRawValue(
    livraison: ILivraison | (Partial<NewLivraison> & LivraisonFormDefaults)
  ): LivraisonFormRawValue | PartialWithRequiredKeyOf<NewLivraisonFormRawValue> {
    return {
      ...livraison,
      datelivraison: livraison.datelivraison ? livraison.datelivraison.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
