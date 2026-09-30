import { Injectable, inject } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

// import { DynamicFormControl, DynamicFormDefinition } from '../models/dynamic-form.model';

@Injectable({
  providedIn: 'root',
})
export class DynamicFormBuilderService {
  private readonly fb = inject(FormBuilder);

  build(definition: DynamicForm): FormGroup {
    const controls: Record<string, FormControl> = {};
    if (!definition) {
      return this.fb.group(controls);
    }
    console.log('[definition]', definition);
    for (const definitionControl of definition.controls) {
      controls[definitionControl.key] = this.createControl(definitionControl);
    }

    return this.fb.group(controls);
  }

  private createControl(definition: DynamicControl): FormControl {
    const validators: ValidatorFn[] = [];

    // Required

    if (definition.required) {
      validators.push(Validators.required);
    }

    // Min Length

    if (definition.minLength !== undefined) {
      validators.push(Validators.minLength(definition.minLength));
    }

    // Max Length

    if (definition.maxLength !== undefined) {
      validators.push(Validators.maxLength(definition.maxLength));
    }

    // Min

    if (definition.min !== undefined) {
      validators.push(Validators.min(definition.min));
    }

    // Max

    if (definition.max !== undefined) {
      validators.push(Validators.max(definition.max));
    }

    // Email

    if (definition.type === 'email') {
      validators.push(Validators.email);
    }

    // Pattern

    if (definition.pattern) {
      validators.push(Validators.pattern(definition.pattern));
    }

    return new FormControl(
      {
        value: definition.defaultValue ?? null,

        disabled: definition.disabled ?? false,
      },

      validators,
    );
  }
}
