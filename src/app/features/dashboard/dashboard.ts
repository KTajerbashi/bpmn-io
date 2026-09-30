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
  // userForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.dasboardForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', Validators.required],
      version: [0, Validators.required],
      option: this.fb.group({}),
    });
  }

  ngOnInit(): void {
    this.dasboardForm.get('version')?.valueChanges.subscribe((version: number) => {
      console.log('[version]', version);
      this.loadForm(version, version);
    });
  }

  onSelectedForm(version: number) {
    console.log('[version]', version);
    this.loadForm(version, version);
  }

  private loadForm(formId: number, version: number): void {
    this.dynamicFormService.getForm(formId, version).subscribe({
      next: (definition) => {
        this.formDefinition = definition;
        const userForm = this.dynamicFormBuilder.build(definition);
        this.dasboardForm.setControl('option', userForm);
      },
      error: (error) => {
        console.error('Failed to load form', error);
      },
    });
  }

  onSubmit(): void {
    if (!this.dasboardForm) {
      return;
    }
    if (this.dasboardForm.invalid) {
      this.dasboardForm.markAllAsTouched();
      return;
    }
    const formValue = this.dasboardForm.getRawValue();
    console.log('Form Value:', formValue);
    console.log('Form Definition:', this.formDefinition);
    // Call API here
  }

  onCancel(): void {
    if (!this.dasboardForm) {
      return;
    }
    this.dasboardForm.reset();
  }

  getControl(key: string) {
    // return this.dasboardForm.get(key);
    return this.dasboardForm.get(`option.${key}`);
  }

  hasError(key: string, error: string): boolean {
    const control = this.getControl(key);

    return !!(control && control.hasError(error) && control.touched);
  }
}
