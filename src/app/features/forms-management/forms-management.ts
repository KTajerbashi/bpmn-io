import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forms-management',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './forms-management.scss',
  templateUrl: './forms-management.html',
})
export class FormsManagement implements OnInit {
  forms: IForm[] = [];

  form!: FormGroup;
  editingIndex: number | null = null;

  /** Keys used for the dynamic option fields */
  readonly formOptionKeys: string[] = ['title', 'key', 'year', 'model', 'createDate'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.seedForms();
  }

  /* ------------------------------------------------------------------ */
  /*  Form setup                                                         */
  /* ------------------------------------------------------------------ */

  private buildForm(): void {
    this.form = this.fb.group({
      id: [this.nextId(), Validators.required],
      title: ['', Validators.required],
      description: [''],
      version: [''],
      option: this.fb.array(this.formOptionKeys.map((key) => this.createOptionGroup(key))),
    });
  }

  private createOptionGroup(key: string, value = ''): FormGroup {
    return this.fb.group({
      key: [{ value: key, disabled: true }],
      value: [value],
    });
  }

  private nextId(): number {
    return this.forms.length ? Math.max(...this.forms.map((f) => f.id)) + 1 : 1;
  }

  /* ------------------------------------------------------------------ */
  /*  Getters                                                            */
  /* ------------------------------------------------------------------ */

  get options(): FormArray {
    return this.form.get('option') as FormArray;
  }

  get isEditing(): boolean {
    return this.editingIndex !== null;
  }

  /* ------------------------------------------------------------------ */
  /*  Submit / Reset / Cancel                                            */
  /* ------------------------------------------------------------------ */

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // getRawValue() includes the disabled 'key' controls
    const value: IForm = this.form.getRawValue();
    console.log('this.form ', value);
    if (this.editingIndex !== null) {
      // Update existing
      this.forms[this.editingIndex] = value;
      this.forms = [...this.forms]; // trigger change detection
    } else {
      // Create new
      this.forms = [...this.forms, value];
    }

    this.resetForm();
  }

  resetForm(): void {
    this.editingIndex = null;
    this.form.reset();
    this.buildForm(); // rebuild to reset FormArray cleanly
  }

  /* ------------------------------------------------------------------ */
  /*  Row actions                                                        */
  /* ------------------------------------------------------------------ */

  editForm(index: number): void {
    const target = this.forms[index];
    this.editingIndex = index;

    this.form.patchValue({
      id: target.id,
      title: target.title,
      description: target.description,
      version: target.version,
    });

    // Patch the option array
    this.options.clear();
    target.option.forEach((opt) => this.options.push(this.createOptionGroup(opt.key, opt.value)));
  }

  deleteForm(index: number): void {
    this.forms = this.forms.filter((_, i) => i !== index);

    // If we deleted the row being edited, reset the form
    if (this.editingIndex === index) {
      this.resetForm();
    } else if (this.editingIndex !== null && index < this.editingIndex) {
      this.editingIndex--;
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                            */
  /* ------------------------------------------------------------------ */

  getOptionValue(form: IForm, key: string): string {
    return form.option.find((o) => o.key === key)?.value ?? '';
  }

  /** Demo data so the list isn't empty on load */
  private seedForms(): void {
    this.forms = [
      {
        id: 1,
        title: 'Invoice Form',
        description: 'Standard invoice template',
        version: '1.0.0',
        option: [
          { key: 'title', value: 'Invoice' },
          { key: 'key', value: 'INV-001' },
          { key: 'year', value: '2024' },
          { key: 'model', value: 'Standard' },
          { key: 'createDate', value: '2024-01-15' },
        ],
      },
    ];
  }
}
