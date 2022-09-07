import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFacture, NewFacture } from '../facture.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFacture for edit and NewFactureFormGroupInput for create.
 */
type FactureFormGroupInput = IFacture | PartialWithRequiredKeyOf<NewFacture>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFacture | NewFacture> = Omit<T, 'datefacture'> & {
  datefacture?: string | null;
};

type FactureFormRawValue = FormValueOf<IFacture>;

type NewFactureFormRawValue = FormValueOf<NewFacture>;

type FactureFormDefaults = Pick<NewFacture, 'id' | 'datefacture'>;

type FactureFormGroupContent = {
  id: FormControl<FactureFormRawValue['id'] | NewFacture['id']>;
  numerofacture: FormControl<FactureFormRawValue['numerofacture']>;
  datefacture: FormControl<FactureFormRawValue['datefacture']>;
  montant: FormControl<FactureFormRawValue['montant']>;
  commande: FormControl<FactureFormRawValue['commande']>;
};

export type FactureFormGroup = FormGroup<FactureFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FactureFormService {
  createFactureFormGroup(facture: FactureFormGroupInput = { id: null }): FactureFormGroup {
    const factureRawValue = this.convertFactureToFactureRawValue({
      ...this.getFormDefaults(),
      ...facture,
    });
    return new FormGroup<FactureFormGroupContent>({
      id: new FormControl(
        { value: factureRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      numerofacture: new FormControl(factureRawValue.numerofacture),
      datefacture: new FormControl(factureRawValue.datefacture),
      montant: new FormControl(factureRawValue.montant),
      commande: new FormControl(factureRawValue.commande),
    });
  }

  getFacture(form: FactureFormGroup): IFacture | NewFacture {
    return this.convertFactureRawValueToFacture(form.getRawValue() as FactureFormRawValue | NewFactureFormRawValue);
  }

  resetForm(form: FactureFormGroup, facture: FactureFormGroupInput): void {
    const factureRawValue = this.convertFactureToFactureRawValue({ ...this.getFormDefaults(), ...facture });
    form.reset(
      {
        ...factureRawValue,
        id: { value: factureRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FactureFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      datefacture: currentTime,
    };
  }

  private convertFactureRawValueToFacture(rawFacture: FactureFormRawValue | NewFactureFormRawValue): IFacture | NewFacture {
    return {
      ...rawFacture,
      datefacture: dayjs(rawFacture.datefacture, DATE_TIME_FORMAT),
    };
  }

  private convertFactureToFactureRawValue(
    facture: IFacture | (Partial<NewFacture> & FactureFormDefaults)
  ): FactureFormRawValue | PartialWithRequiredKeyOf<NewFactureFormRawValue> {
    return {
      ...facture,
      datefacture: facture.datefacture ? facture.datefacture.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
