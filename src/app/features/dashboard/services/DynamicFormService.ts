import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DynamicFormService {
  forms: DynamicForm[] = [
    {
      formId: 1,
      version: 1,
      title: 'User Information',
      controls: [
        {
          order: 1,
          id: 'title',
          key: 'title',
          type: 'text',
          label: 'Title',
          width: 6,
          required: true,
          maxLength: 100,
          placeholder: 'Enter title',
        },

        {
          order: 2,
          id: 'description',
          key: 'description',
          type: 'textarea',

          label: 'Description',

          width: 6,

          maxLength: 500,

          placeholder: 'Enter description',
        },

        {
          order: 3,
          id: 'sex',
          key: 'sex',
          type: 'select',

          label: 'Sex',

          width: 6,

          required: true,

          options: [
            {
              label: 'Male',
              value: 'male',
            },
            {
              label: 'Female',
              value: 'female',
            },
          ],
        },

        {
          order: 4,
          id: 'email',
          key: 'email',
          type: 'email',

          label: 'Email',

          width: 6,

          required: true,

          placeholder: 'example@email.com',
        },

        {
          order: 5,
          id: 'phone',
          key: 'phone',
          type: 'phone',

          label: 'Phone',

          width: 6,

          pattern: '^[0-9+\\-\\s()]+$',

          placeholder: '+98 912 345 6789',
        },
      ],
    },
    {
      formId: 2,
      version: 2,
      title: 'User Information',
      controls: [
        {
          order: 1,
          id: 'username',
          key: 'username',
          type: 'text',
          label: 'Username',
          width: 6,
          required: true,
          maxLength: 100,
          placeholder: 'Enter title',
        },
        {
          order: 2,
          id: 'password',
          key: 'password',
          type: 'password',
          label: 'Password',
          width: 6,
          maxLength:8,
          minLength:4,
          placeholder: 'Enter password ...',
        },
      ],
    },
  ];

  getForm(formId: number, version?: number): Observable<DynamicForm> {
    // بعداً این قسمت را با HttpClient جایگزین می‌کنیم.
    const index = this.forms.findIndex((x) => x.formId == formId && x.version == version);
    const form = this.forms[index];
    return of(form);
  }
}
