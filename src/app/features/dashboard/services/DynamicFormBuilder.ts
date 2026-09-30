import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export class DynamicFormBuilder {
  constructor(private readonly fb: FormBuilder) {}

  buildForm(definition: DynamicForm): FormGroup {
    const controls: Record<string, FormControl> = {};

    for (const control of definition.controls) {
      const validators = [];

      if (control.required) {
        validators.push(Validators.required);
      }

      if (control.minLength) {
        validators.push(Validators.minLength(control.minLength));
      }

      if (control.maxLength) {
        validators.push(Validators.maxLength(control.maxLength));
      }

      if (control.min !== undefined) {
        validators.push(Validators.min(control.min));
      }

      if (control.max !== undefined) {
        validators.push(Validators.max(control.max));
      }

      if (control.type === 'email') {
        validators.push(Validators.email);
      }

      if (control.pattern) {
        validators.push(Validators.pattern(control.pattern));
      }

      controls[control.key] = new FormControl(
        {
          value: control.defaultValue ?? null,
          disabled: control.disabled ?? false,
        },
        validators,
      );
    }

    return this.fb.group(controls);
  }
}
