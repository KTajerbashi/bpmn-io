import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormBuilder } from '../services/DynamicFormBuilder';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-dynamic-form',
  styleUrl: './dynamic-form.scss',
  templateUrl: './dynamic-form.html',
})
export class DynamicFormComponent {
  form!: FormGroup;

  definition!: DynamicForm;

  constructor(private readonly formBuilder: DynamicFormBuilder) {}

  loadForm(definition: DynamicForm): void {
    this.definition = definition;

    this.form = this.formBuilder.buildForm(definition);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const value = this.form.getRawValue();

    console.log(value);

    // API
  }
}
