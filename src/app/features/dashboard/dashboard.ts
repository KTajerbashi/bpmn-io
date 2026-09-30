import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicFormService } from './services/DynamicFormService';
import { DynamicFormBuilderService } from './services/DynamicFormBuilderService';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly dynamicFormService = inject(DynamicFormService);
  private readonly dynamicFormBuilder = inject(DynamicFormBuilderService);
  formDefinition!: DynamicForm;
  dasboardForm: FormGroup;
  userForm!: FormGroup;

  /**
   *
   */
  constructor(private fb: FormBuilder) {
    this.dasboardForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', Validators.required],
      option: this.fb.group({}),
    });
  }
  ngOnInit(): void {}

  onSelectedForm(version: number) {
    console.log('[version]', version);
    this.loadForm(version, version);
  }

  private loadForm(formId: number, version: number): void {
    this.dynamicFormService.getForm(formId, version).subscribe({
      next: (definition) => {
        console.log('[definition]', definition);
        this.formDefinition = definition;
        this.userForm = this.dynamicFormBuilder.build(definition);
      },
      error: (error) => {
        console.error('Failed to load form', error);
      },
    });
  }

  onSubmit(): void {
    if (!this.userForm) {
      return;
    }
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const formValue = this.userForm.getRawValue();
    console.log('Form Value:', formValue);
    console.log('Form Definition:', this.formDefinition);
    // Call API here
  }

  onCancel(): void {
    if (!this.userForm) {
      return;
    }
    this.userForm.reset();
  }

  getControl(key: string) {
    return this.userForm.get(key);
  }

  hasError(key: string, error: string): boolean {
    const control = this.getControl(key);

    return !!(control && control.hasError(error) && control.touched);
  }
}
