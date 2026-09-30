export const FORMJSON = `
{
  "formId": 2037,
  "version": 3,
  "title": "User Information",
  "controls": [
    {
      "key": "title",
      "type": "text",
      "label": "Title",
      "required": true,
      "order": 1,
      "width": 6
    },
    {
      "key": "description",
      "type": "textarea",
      "label": "Description",
      "required": false,
      "order": 2,
      "width": 6
    },
    {
      "key": "sex",
      "type": "select",
      "label": "Sex",
      "required": true,
      "order": 3,
      "width": 6,
      "options": [
        {
          "label": "Male",
          "value": "male"
        },
        {
          "label": "Female",
          "value": "female"
        }
      ]
    },
    {
      "key": "email",
      "type": "email",
      "label": "Email",
      "required": true,
      "order": 4,
      "width": 6
    },
    {
      "key": "phone",
      "type": "phone",
      "label": "Phone",
      "required": false,
      "order": 5,
      "width": 6
    }
  ]
}
  `;
